import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const blank = { name: '', full_name: '', url: '', is_active: true, sort_order: 0, image_url: null };

function MembershipDialog({ item, onClose, onSaved }) {
  const [f, setF] = useState(item);
  const [file, setFile] = useState(null);
  const [remove, setRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const preview = file ? URL.createObjectURL(file) : remove ? null : f.image_url;

  const save = async () => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('name', f.name);
      fd.append('full_name', f.full_name ?? '');
      fd.append('url', f.url ?? '');
      fd.append('sort_order', f.sort_order);
      fd.append('is_active', f.is_active ? '1' : '0');
      if (file) fd.append('image', file);
      if (remove) fd.append('remove_image', '1');
      await api(f.id ? `/memberships/${f.id}` : '/memberships', { method: 'POST', form: fd });
      toast.success('Saved'); onSaved(); onClose();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{f.id ? `Edit ${f.name}` : 'New certification / membership'}</DialogTitle><DialogDescription>The logo is shown in the website footer section "Certifications and Membership".</DialogDescription></DialogHeader>
        <div className="grid gap-4">
          <Field label="Logo image" hint="PNG, JPG, WebP or SVG, max 2 MB. A wide logo on a transparent or white background works best.">
            {preview && <div className="bg-muted flex h-24 items-center justify-center rounded-md p-3"><img src={preview} alt="" className="max-h-full max-w-full object-contain" /></div>}
            <Input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files[0] || null); setRemove(false); }} />
            {f.image_url && !file && <div className="flex items-center gap-2"><Switch id="rm" checked={remove} onCheckedChange={setRemove} /><Label htmlFor="rm">Remove current logo</Label></div>}
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Short name"><Input value={f.name} onChange={set('name')} placeholder="BASIS" /></Field>
            <Field label="Sort order"><Input type="number" min="0" value={f.sort_order} onChange={set('sort_order')} /></Field>
          </div>
          <Field label="Full name" hint="Used as the image description and shown if no logo is uploaded"><Input value={f.full_name ?? ''} onChange={set('full_name')} /></Field>
          <Field label="Link (optional)"><Input value={f.url ?? ''} onChange={set('url')} placeholder="https://" /></Field>
          <div className="flex items-center gap-2"><Switch id="act" checked={!!f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: v })} /><Label htmlFor="act">Visible on site</Label></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={busy || !f.name}>{busy ? 'Saving…' : 'Save'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Memberships() {
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const load = () => api('/memberships').then(setRows);
  useEffect(() => { load(); }, []);

  const del = async (m) => {
    if (!window.confirm(`Delete ${m.name}?`)) return;
    try { await api(`/memberships/${m.id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch (e) { toast.error(e.message); }
  };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Certifications" description="Logos for the “Certifications and Membership” section of the website footer.">
        <Button onClick={() => setEdit({ ...blank, sort_order: (rows.length + 1) * 10 })}><Plus /> Add logo</Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((m) => (
          <Card key={m.id} className="gap-3 py-4">
            <CardContent className="grid gap-3">
              <div className="bg-muted flex h-28 items-center justify-center rounded-md p-3">
                {m.image_url ? <img src={m.image_url} alt={m.name} className="max-h-full max-w-full object-contain" /> : <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs"><ImageIcon className="size-6" />No logo uploaded</div>}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div><div className="font-semibold">{m.name}</div><div className="text-muted-foreground text-xs">{m.full_name}</div></div>
                {m.is_active ? <Badge variant="success">Visible</Badge> : <Badge variant="secondary">Hidden</Badge>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEdit(m)}><Pencil /> Edit</Button>
                <Button size="icon" variant="ghost" onClick={() => del(m)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!rows.length && <p className="text-muted-foreground">No logos yet.</p>}
      </div>
      {edit && <MembershipDialog item={edit} onClose={() => setEdit(null)} onSaved={load} />}
    </>
  );
}
