import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { api, download } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statuses = ['new', 'reviewed', 'shortlisted', 'rejected'];

export default function Applications() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api('/applications').then(setRows); }, []);

  const setStatus = async (a, status) => {
    try { const u = await api(`/applications/${a.id}`, { method: 'PUT', body: { status } }); setRows((r) => r.map((x) => (x.id === a.id ? u : x))); toast.success('Status updated'); }
    catch (e) { toast.error(e.message); }
  };
  const cv = async (a) => { try { await download(`/applications/${a.id}/cv`, a.cv_original_name); } catch (e) { toast.error(e.message); } };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Job Applications" description="Applications submitted from the Careers page." />
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Applicant</TableHead><TableHead>Position</TableHead><TableHead>Contact</TableHead><TableHead>CV</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}{a.cover_note && <div className="text-muted-foreground max-w-56 truncate text-xs font-normal" title={a.cover_note}>{a.cover_note}</div>}</TableCell>
                <TableCell className="max-w-56 text-xs">{a.position}</TableCell>
                <TableCell className="text-xs">{a.email}<br />{a.phone}</TableCell>
                <TableCell><Button size="sm" variant="outline" onClick={() => cv(a)}><Download /> CV</Button></TableCell>
                <TableCell>
                  <Select value={a.status} onValueChange={(v) => setStatus(a, v)}>
                    <SelectTrigger size="sm" className="w-32 capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={6} className="text-muted-foreground py-8 text-center">No applications yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </>
  );
}
