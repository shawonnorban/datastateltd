import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function SectionEdit() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [json, setJson] = useState('');
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = (d) => {
    const { image: _i, image_url: _u, ...rest } = d.data || {};
    setS(d); setJson(JSON.stringify(rest, null, 2)); setImage(null); setRemoveImage(false);
  };
  useEffect(() => { api(`/sections/${id}`).then(load); }, [id]);

  const save = async () => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('eyebrow', s.eyebrow ?? '');
      fd.append('title', s.title ?? '');
      fd.append('subtitle', s.subtitle ?? '');
      fd.append('sort_order', s.sort_order);
      fd.append('is_active', s.is_active ? '1' : '0');
      fd.append('data', json.trim() === '{}' ? '' : json);
      if (image) fd.append('image', image);
      if (removeImage) fd.append('remove_image', '1');
      load(await api(`/sections/${id}`, { method: 'POST', form: fd }));
      toast.success('Section saved');
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  if (!s) return <p className="text-muted-foreground">Loading…</p>;
  const set = (k) => (e) => setS((x) => ({ ...x, [k]: e.target.value }));

  return (
    <>
      <Link to="/sections" className="text-muted-foreground mb-3 inline-flex items-center gap-1 text-sm hover:underline"><ArrowLeft className="size-4" /> All sections</Link>
      <PageHeader title={s.title || s.key} description={`Page /${s.page === 'home' ? '' : s.page}`}>
        <Badge variant="outline">{s.type}</Badge>
        <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save section'}</Button>
      </PageHeader>
      <Card><CardContent className="grid gap-5 md:grid-cols-2">
        <Field label="Eyebrow (small label)"><Input value={s.eyebrow ?? ''} onChange={set('eyebrow')} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sort order"><Input type="number" min="0" value={s.sort_order} onChange={set('sort_order')} /></Field>
          <div className="flex items-end gap-2 pb-2"><Switch id="active" checked={!!s.is_active} onCheckedChange={(v) => setS((x) => ({ ...x, is_active: v }))} /><Label htmlFor="active">Visible on site</Label></div>
        </div>
        <Field label="Title" className="md:col-span-2" hint="Wrap words in <em>…</em> to highlight them."><Input value={s.title ?? ''} onChange={set('title')} /></Field>
        <Field label="Subtitle" className="md:col-span-2"><Textarea rows={3} value={s.subtitle ?? ''} onChange={set('subtitle')} /></Field>
        {s.type === 'hero' && (
          <Field label="Banner image for this section" className="md:col-span-2" hint="Overrides the site-wide hero banner. PNG, JPG or WebP, max 4 MB.">
            {s.image_url && !removeImage && <img src={s.image_url} alt="" className="max-h-28 w-fit rounded-md" />}
            <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImage(e.target.files[0] || null)} />
            {s.image_url && <div className="flex items-center gap-2"><Switch id="ri" checked={removeImage} onCheckedChange={setRemoveImage} /><Label htmlFor="ri">Remove image</Label></div>}
          </Field>
        )}
        <Field label="Content (JSON)" className="md:col-span-2" hint="Items, buttons, bullets, prices etc. Keep the JSON valid.">
          <Textarea rows={20} className="font-mono text-xs" value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
        </Field>
      </CardContent></Card>
    </>
  );
}
