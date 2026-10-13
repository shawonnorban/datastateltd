import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const blank = {
  title: '', slug: '', subtitle: '', company: 'Inspire BD IT', location: '', employment_type: '', experience_level: '', salary: '',
  vacancies: '', deadline: '', summary: '', sections: [{ title: "What You'll Learn & Do", items: [] }, { title: 'Who Can Apply', items: [] }, { title: 'Perks & Benefits', items: [] }],
  is_active: true, sort_order: 0,
};

function JobDialog({ job, onClose, onSaved }) {
  const [f, setF] = useState({ ...job, deadline: job.deadline ? String(job.deadline).slice(0, 10) : '', vacancies: job.vacancies ?? '' });
  const [secs, setSecs] = useState((job.sections || []).map((s) => ({ title: s.title, text: (s.items || []).join('\n') })));
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const setSec = (i, k, v) => setSecs((s) => s.map((x, n) => (n === i ? { ...x, [k]: v } : x)));

  const save = async () => {
    setBusy(true);
    try {
      const body = {
        title: f.title, slug: f.slug || null, subtitle: f.subtitle || null, company: f.company || null, location: f.location || null,
        employment_type: f.employment_type || null, experience_level: f.experience_level || null, salary: f.salary || null,
        vacancies: f.vacancies === '' ? null : Number(f.vacancies), deadline: f.deadline || null, summary: f.summary || null,
        sections: secs.filter((s) => s.title.trim()).map((s) => ({ title: s.title.trim(), items: s.text.split('\n').map((l) => l.trim()).filter(Boolean) })),
        is_active: !!f.is_active, sort_order: Number(f.sort_order) || 0,
      };
      await api(f.id ? `/jobs/${f.id}` : '/jobs', { method: f.id ? 'PUT' : 'POST', body });
      toast.success('Job saved'); onSaved(); onClose();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader><DialogTitle>{f.id ? 'Edit job' : 'New job'}</DialogTitle><DialogDescription>Shown on the Careers page and its own job details page.</DialogDescription></DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Job title" className="md:col-span-2"><Input value={f.title} onChange={set('title')} /></Field>
          <Field label="Subtitle" hint="e.g. ERP Development, Implementation & Maintenance"><Input value={f.subtitle ?? ''} onChange={set('subtitle')} /></Field>
          <Field label="URL slug" hint="Leave empty to generate from the title"><Input value={f.slug ?? ''} onChange={set('slug')} placeholder="intern-software-engineer" /></Field>
          <Field label="Company"><Input value={f.company ?? ''} onChange={set('company')} /></Field>
          <Field label="Location"><Input value={f.location ?? ''} onChange={set('location')} placeholder="Dhaka, Bangladesh (Remote/Hybrid)" /></Field>
          <Field label="Employment type"><Input value={f.employment_type ?? ''} onChange={set('employment_type')} placeholder="Full-time / Internship" /></Field>
          <Field label="Experience level"><Input value={f.experience_level ?? ''} onChange={set('experience_level')} placeholder="Entry Level" /></Field>
          <Field label="Salary"><Input value={f.salary ?? ''} onChange={set('salary')} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vacancies"><Input type="number" min="1" value={f.vacancies} onChange={set('vacancies')} /></Field>
            <Field label="Deadline"><Input type="date" value={f.deadline} onChange={set('deadline')} /></Field>
          </div>
          <Field label="Short summary" className="md:col-span-2" hint="One or two lines shown in the job list and at the top of the details page"><Textarea rows={2} value={f.summary ?? ''} onChange={set('summary')} /></Field>

          <div className="md:col-span-2 grid gap-3">
            <Label>Detail sections</Label>
            {secs.map((s, i) => (
              <div key={i} className="grid gap-2 rounded-md border p-3">
                <div className="flex gap-2"><Input value={s.title} onChange={(e) => setSec(i, 'title', e.target.value)} placeholder="Section title (e.g. Who Can Apply)" /><Button variant="ghost" size="icon" onClick={() => setSecs((x) => x.filter((_, n) => n !== i))} aria-label="Remove section"><X className="text-destructive" /></Button></div>
                <Textarea rows={5} value={s.text} onChange={(e) => setSec(i, 'text', e.target.value)} placeholder="One bullet point per line" />
              </div>
            ))}
            <Button type="button" variant="outline" className="w-fit" onClick={() => setSecs((x) => [...x, { title: '', text: '' }])}><Plus /> Add section</Button>
          </div>

          <Field label="Sort order"><Input type="number" min="0" value={f.sort_order} onChange={set('sort_order')} /></Field>
          <div className="flex items-end gap-2 pb-2"><Switch id="jact" checked={!!f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: v })} /><Label htmlFor="jact">Published (accepting applications)</Label></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={busy || !f.title}>{busy ? 'Saving…' : 'Save job'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Jobs() {
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const load = () => api('/jobs').then(setRows);
  useEffect(() => { load(); }, []);

  const del = async (j) => {
    if (!window.confirm(`Delete “${j.title}”? Its applications are kept.`)) return;
    try { await api(`/jobs/${j.id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch (e) { toast.error(e.message); }
  };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader title="Jobs" description="Positions shown on the Careers page. Each job has its own details page and application form.">
        <Button onClick={() => setEdit({ ...blank, sort_order: (rows.length + 1) * 10 })}><Plus /> New job</Button>
      </PageHeader>
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Job</TableHead><TableHead>Type</TableHead><TableHead>Deadline</TableHead><TableHead>Applicants</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {rows.map((j) => {
              const expired = j.deadline && String(j.deadline).slice(0, 10) < today;
              return (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.title}<div className="text-muted-foreground text-xs font-normal">{j.location}</div></TableCell>
                  <TableCell className="text-xs">{j.employment_type}<br />{j.experience_level}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{j.deadline ? String(j.deadline).slice(0, 10) : '—'}</TableCell>
                  <TableCell><Link to={`/applications?job_id=${j.id}`} className="text-primary underline-offset-2 hover:underline">{j.applications_count}</Link></TableCell>
                  <TableCell>{!j.is_active ? <Badge variant="secondary">Hidden</Badge> : expired ? <Badge variant="warning">Closed</Badge> : <Badge variant="success">Open</Badge>}</TableCell>
                  <TableCell className="space-x-1 text-right whitespace-nowrap">
                    <Button asChild size="icon" variant="ghost" aria-label="View on site"><a href={`/jobs/${j.slug}`} target="_blank" rel="noreferrer"><Eye /></a></Button>
                    <Button size="sm" variant="outline" onClick={() => setEdit(j)}><Pencil /> Edit</Button>
                    <Button size="icon" variant="ghost" onClick={() => del(j)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {!rows.length && <TableRow><TableCell colSpan={6} className="text-muted-foreground py-8 text-center">No jobs yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
      {edit && <JobDialog job={edit} onClose={() => setEdit(null)} onSaved={load} />}
    </>
  );
}
