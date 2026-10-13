import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statuses = ['new', 'contacted', 'closed'];

export default function Inquiries() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);
  useEffect(() => { api('/inquiries').then(setRows); }, []);

  const save = async () => {
    try {
      const u = await api(`/inquiries/${open.id}`, { method: 'PUT', body: { status: open.status, admin_notes: open.admin_notes || null } });
      setRows((r) => r.map((x) => (x.id === u.id ? u : x))); setOpen(null); toast.success('Inquiry updated');
    } catch (e) { toast.error(e.message); }
  };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Inquiries" description="Messages from the contact, demo and quotation forms." />
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {rows.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.name}<div className="text-muted-foreground text-xs font-normal">{i.email}{i.phone ? ` · ${i.phone}` : ''}</div></TableCell>
                <TableCell>{i.subject}</TableCell>
                <TableCell><Badge variant={i.status === 'new' ? 'warning' : i.status === 'closed' ? 'secondary' : 'success'}>{i.status}</Badge></TableCell>
                <TableCell className="text-xs whitespace-nowrap">{new Date(i.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => setOpen({ ...i })}>View</Button></TableCell>
              </TableRow>
            ))}
            {!rows.length && <TableRow><TableCell colSpan={5} className="text-muted-foreground py-8 text-center">No inquiries yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{open?.name}</DialogTitle><DialogDescription>{open?.email}{open?.phone ? ` · ${open.phone}` : ''}{open?.company ? ` · ${open.company}` : ''}</DialogDescription></DialogHeader>
          {open && (
            <div className="grid gap-4">
              <div><div className="text-sm font-medium">{open.subject}</div><p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">{open.message || '—'}</p></div>
              <Field label="Status">
                <Select value={open.status} onValueChange={(v) => setOpen({ ...open, status: v })}>
                  <SelectTrigger className="w-40 capitalize"><SelectValue /></SelectTrigger>
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
