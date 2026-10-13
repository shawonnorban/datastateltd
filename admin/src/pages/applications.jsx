import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Download, Eye, FileSpreadsheet, Trash2 } from 'lucide-react';
import { api, download } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statuses = ['new', 'reviewed', 'shortlisted', 'rejected'];
const variant = { new: 'warning', reviewed: 'secondary', shortlisted: 'success', rejected: 'destructive' };
const ALL = '__all__';

export default function Applications() {
  const [sp, setSp] = useSearchParams();
  const [rows, setRows] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const jobId = sp.get('job_id') || ALL;
  const status = sp.get('status') || ALL;

  const load = () => api('/applications').then(setRows);
  useEffect(() => { load(); api('/jobs').then(setJobs); }, []);
  const setFilter = (k, v) => { const n = new URLSearchParams(sp); v === ALL ? n.delete(k) : n.set(k, v); setSp(n, { replace: true }); };

  const list = useMemo(() => (rows || []).filter((a) =>
    (jobId === ALL || String(a.job_id) === jobId) && (status === ALL || a.status === status) &&
    (!q || `${a.name} ${a.email} ${a.phone} ${a.position}`.toLowerCase().includes(q.toLowerCase()))), [rows, jobId, status, q]);

  const save = async () => {
    try {
      const u = await api(`/applications/${open.id}`, { method: 'PUT', body: { status: open.status, admin_notes: open.admin_notes || null } });
      setRows((r) => r.map((x) => (x.id === u.id ? u : x))); setOpen(null); toast.success('Application updated');
    } catch (e) { toast.error(e.message); }
  };
  const quick = async (a, s) => {
    try { const u = await api(`/applications/${a.id}`, { method: 'PUT', body: { status: s, admin_notes: a.admin_notes } }); setRows((r) => r.map((x) => (x.id === u.id ? u : x))); } catch (e) { toast.error(e.message); }
  };
  const del = async (a) => {
    if (!window.confirm(`Delete the application from ${a.name}? The CV file is deleted too.`)) return;
    try { await api(`/applications/${a.id}`, { method: 'DELETE' }); setRows((r) => r.filter((x) => x.id !== a.id)); setOpen(null); toast.success('Deleted'); } catch (e) { toast.error(e.message); }
  };
  const cv = async (a) => { try { await download(`/applications/${a.id}/cv`, a.cv_original_name); } catch (e) { toast.error(e.message); } };
  const exportCsv = async () => { try { await download('/applications/export', 'job-applications.csv'); } catch (e) { toast.error(e.message); } };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Job Applications" description={`${list.length} of ${rows.length} applications`}>
        <Button variant="outline" onClick={exportCsv}><FileSpreadsheet /> Export CSV</Button>
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input placeholder="Search name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64 bg-white" />
        <Select value={jobId} onValueChange={(v) => setFilter('job_id', v)}>
          <SelectTrigger className="w-64 bg-white"><SelectValue placeholder="All jobs" /></SelectTrigger>
          <SelectContent><SelectItem value={ALL}>All jobs</SelectItem>{jobs.map((j) => <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setFilter('status', v)}>
          <SelectTrigger className="w-40 bg-white capitalize"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent><SelectItem value={ALL}>All statuses</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Applicant</TableHead><TableHead>Position</TableHead><TableHead>Contact</TableHead><TableHead>Status</TableHead><TableHead>Applied</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell className="max-w-56 text-xs">{a.job?.title || a.position}</TableCell>
                <TableCell className="text-xs">{a.email}<br />{a.phone}</TableCell>
                <TableCell>
                  <Select value={a.status} onValueChange={(v) => quick(a, v)}>
                    <SelectTrigger size="sm" className="w-32 capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-1 text-right whitespace-nowrap">
                  <Button size="sm" variant="outline" onClick={() => cv(a)}><Download /> CV</Button>
                  <Button size="icon" variant="ghost" onClick={() => setOpen({ ...a })} aria-label="Details"><Eye /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(a)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={6} className="text-muted-foreground py-8 text-center">No applications found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{open?.name}</DialogTitle><DialogDescription>{open?.job?.title || open?.position}</DialogDescription></DialogHeader>
          {open && (
            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-muted-foreground text-xs">Email</div><a className="text-primary" href={`mailto:${open.email}`}>{open.email}</a></div>
                <div><div className="text-muted-foreground text-xs">Phone</div><a className="text-primary" href={`tel:${open.phone}`}>{open.phone}</a></div>
                <div><div className="text-muted-foreground text-xs">Applied</div>{new Date(open.created_at).toLocaleString()}</div>
                <div><div className="text-muted-foreground text-xs">CV file</div><Button size="sm" variant="outline" onClick={() => cv(open)}><Download /> {open.cv_original_name || 'Download'}</Button></div>
              </div>
              {open.cover_note && <div><div className="text-muted-foreground text-xs">Cover note</div><p className="whitespace-pre-wrap">{open.cover_note}</p></div>}
              <Field label="Status">
                <Select value={open.status} onValueChange={(v) => setOpen({ ...open, status: v })}>
                  <SelectTrigger className="w-44 capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Internal notes"><Textarea rows={3} value={open.admin_notes ?? ''} onChange={(e) => setOpen({ ...open, admin_notes: e.target.value })} /></Field>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(null)}>Close</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
