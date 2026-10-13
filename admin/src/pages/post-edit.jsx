import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { renderMarkdown } from '@/lib/markdown';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NONE = '__none__';
const blank = { type: 'blog', title: '', slug: '', post_category_id: null, excerpt: '', content: '', status: 'draft', published_at: '', meta_title: '', meta_description: '', read_minutes: '', image_url: null };

export default function PostEdit() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const isNew = id === 'new';
  const [f, setF] = useState(isNew ? { ...blank, type: sp.get('type') === 'news' ? 'news' : 'blog' } : null);
  const [cats, setCats] = useState([]);
  const [file, setFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api('/categories').then(setCats); }, []);
  useEffect(() => { if (!isNew) api(`/posts/${id}`).then((p) => setF({ ...p, excerpt: p.excerpt ?? '', content: p.content ?? '', meta_title: p.meta_title ?? '', meta_description: p.meta_description ?? '', read_minutes: p.read_minutes ?? '', published_at: p.published_at ?? '' })); }, [id, isNew]);
  const html = useMemo(() => renderMarkdown(f?.content), [f?.content]);

  if (!f) return <p className="text-muted-foreground">Loading…</p>;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const preview = file ? URL.createObjectURL(file) : removeImage ? null : f.image_url;

  const save = async (status) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('type', f.type);
      fd.append('title', f.title);
      fd.append('slug', f.slug ?? '');
      if (f.post_category_id) fd.append('post_category_id', f.post_category_id);
      fd.append('excerpt', f.excerpt ?? '');
      fd.append('content', f.content ?? '');
      fd.append('status', status || f.status);
      if (f.published_at) fd.append('published_at', f.published_at);
      fd.append('meta_title', f.meta_title ?? '');
      fd.append('meta_description', f.meta_description ?? '');
      if (f.read_minutes) fd.append('read_minutes', f.read_minutes);
      if (file) fd.append('image', file);
      if (removeImage) fd.append('remove_image', '1');
      const saved = await api(isNew ? '/posts' : `/posts/${id}`, { method: 'POST', form: fd });
      toast.success(status === 'published' ? 'Published' : 'Saved');
      if (isNew) nav(`/posts/${saved.id}`, { replace: true });
      else { setF({ ...saved, excerpt: saved.excerpt ?? '', content: saved.content ?? '', meta_title: saved.meta_title ?? '', meta_description: saved.meta_description ?? '', read_minutes: saved.read_minutes ?? '', published_at: saved.published_at ?? '' }); setFile(null); setRemoveImage(false); }
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <>
      <Link to="/posts" className="text-muted-foreground mb-3 inline-flex items-center gap-1 text-sm hover:underline"><ArrowLeft className="size-4" /> All posts</Link>
      <PageHeader title={isNew ? 'New post' : 'Edit post'} description={f.status === 'published' ? 'This post is live on the website.' : 'Draft — not visible on the website.'}>
        <Button variant="outline" onClick={() => save('draft')} disabled={busy || !f.title}>Save as draft</Button>
        <Button onClick={() => save('published')} disabled={busy || !f.title}>{f.status === 'published' ? 'Update' : 'Publish'}</Button>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="grid content-start gap-6">
          <Card><CardContent className="grid gap-4">
            <Field label="Title"><Input value={f.title} onChange={set('title')} className="text-base font-medium" /></Field>
            <Field label="Excerpt" hint="Short summary shown in lists and search results"><Textarea rows={3} value={f.excerpt} onChange={set('excerpt')} /></Field>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Content</CardTitle></CardHeader><CardContent>
            <Tabs defaultValue="write">
              <TabsList><TabsTrigger value="write">Write</TabsTrigger><TabsTrigger value="preview">Preview</TabsTrigger></TabsList>
              <TabsContent value="write" className="grid gap-2">
                <Textarea rows={24} className="font-mono text-sm" value={f.content} onChange={set('content')} placeholder={'## Heading\n\nWrite in Markdown: **bold**, *italic*, lists, [links](https://example.com), tables and more.'} spellCheck />
                <p className="text-muted-foreground text-xs">Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list item</code>, <code>[text](url)</code>, <code>![alt](image-url)</code>.</p>
              </TabsContent>
              <TabsContent value="preview"><div className="prose-preview min-h-64 rounded-md border p-5" dangerouslySetInnerHTML={{ __html: html || '<p class="text-muted-foreground">Nothing to preview yet.</p>' }} /></TabsContent>
            </Tabs>
          </CardContent></Card>
        </div>

        <div className="grid content-start gap-6">
          <Card><CardHeader><CardTitle>Publish</CardTitle></CardHeader><CardContent className="grid gap-4">
            <Field label="Type">
              <Select value={f.type} onValueChange={(v) => setF({ ...f, type: v })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="blog">Blog</SelectItem><SelectItem value="news">News</SelectItem></SelectContent></Select>
            </Field>
            <Field label="Status">
              <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v })}><SelectTrigger className="w-full capitalize"><SelectValue /></SelectTrigger><SelectContent>{['draft', 'published', 'archived'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
            </Field>
            <Field label="Publish date" hint="Future dates keep the post hidden until then"><Input type="datetime-local" value={f.published_at} onChange={set('published_at')} /></Field>
            {f.type === 'blog' && (
              <Field label="Category">
                <Select value={f.post_category_id ? String(f.post_category_id) : NONE} onValueChange={(v) => setF({ ...f, post_category_id: v === NONE ? null : Number(v) })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value={NONE}>No category</SelectItem>{cats.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            )}
            <Field label="Read time (minutes)" hint="Leave empty to calculate automatically"><Input type="number" min="1" value={f.read_minutes} onChange={set('read_minutes')} /></Field>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Index image</CardTitle></CardHeader><CardContent className="grid gap-3">
            {preview && <img src={preview} alt="" className="max-h-40 w-full rounded-md object-cover" />}
            <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { setFile(e.target.files[0] || null); setRemoveImage(false); }} />
            {f.image_url && !file && <div className="flex items-center gap-2"><Switch id="ri" checked={removeImage} onCheckedChange={setRemoveImage} /><Label htmlFor="ri">Remove image</Label></div>}
            <p className="text-muted-foreground text-xs">Shown only on the blog/news list (index) page, not inside the post. Best size 1280×720 (16:9). PNG, JPG or WebP, max 4 MB. Optional.</p>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>SEO</CardTitle></CardHeader><CardContent className="grid gap-4">
            <Field label="URL slug" hint="Leave empty to generate from the title"><Input value={f.slug ?? ''} onChange={set('slug')} /></Field>
            <Field label="Meta title"><Input value={f.meta_title} onChange={set('meta_title')} /></Field>
            <Field label="Meta description" hint={`${f.meta_description.length}/160`}><Textarea rows={3} value={f.meta_description} onChange={set('meta_description')} /></Field>
          </CardContent></Card>
        </div>
      </div>
    </>
  );
}
