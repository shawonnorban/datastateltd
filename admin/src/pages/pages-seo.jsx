import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PagesSeo() {
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => api('/pages').then(setRows);
  useEffect(() => { load(); }, []);

  const save = async () => {
    setBusy(true);
    try {
      await api(`/pages/${edit.id}`, { method: 'PUT', body: { title: edit.title, meta_title: edit.meta_title || null, meta_description: edit.meta_description || null, is_published: edit.is_published } });
      toast.success('Page saved'); setEdit(null); load();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Page Titles & SEO" description="Browser tab title and meta description of every page. The site name is added automatically." />
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Path</TableHead><TableHead>Browser title</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">/{p.slug === 'home' ? '' : p.slug}</TableCell>
                <TableCell className="max-w-lg truncate">{p.meta_title || p.title}</TableCell>
                <TableCell>{p.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => setEdit({ ...p })}>Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit page</DialogTitle><DialogDescription className="font-mono">/{edit?.slug === 'home' ? '' : edit?.slug}</DialogDescription></DialogHeader>
          {edit && (
            <div className="grid gap-4">
              <Field label="Page name" hint="Used as fallback title"><Input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
              <Field label="Browser title" hint={`Shown in the tab as “${edit.meta_title || edit.title} | Site name”`}><Input value={edit.meta_title ?? ''} onChange={(e) => setEdit({ ...edit, meta_title: e.target.value })} /></Field>
              <Field label="Meta description" hint={`${(edit.meta_description || '').length}/160 characters recommended`}><Textarea rows={3} value={edit.meta_description ?? ''} onChange={(e) => setEdit({ ...edit, meta_description: e.target.value })} /></Field>
              <div className="flex items-center gap-2"><Switch checked={edit.is_published} onCheckedChange={(v) => setEdit({ ...edit, is_published: v })} id="pub" /><label htmlFor="pub" className="text-sm">Published</label></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={save} disabled={busy}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
