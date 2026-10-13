import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statusBadge = { published: 'success', draft: 'warning', archived: 'secondary' };

function CategoriesDialog({ onClose }) {
  const [rows, setRows] = useState(null);
  const [name, setName] = useState('');
  const load = () => api('/categories').then(setRows);
  useEffect(() => { load(); }, []);

  const add = async () => {
    try { await api('/categories', { method: 'POST', body: { name, description: null, is_active: true } }); setName(''); load(); } catch (e) { toast.error(e.message); }
  };
  const patch = async (c, changes) => {
    try { await api(`/categories/${c.id}`, { method: 'PUT', body: { name: c.name, description: c.description, is_active: c.is_active, ...changes } }); load(); } catch (e) { toast.error(e.message); }
  };
  const del = async (c) => {
    if (!window.confirm(`Delete category “${c.name}”? Posts in it become uncategorised.`)) return;
    try { await api(`/categories/${c.id}`, { method: 'DELETE' }); load(); } catch (e) { toast.error(e.message); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Blog categories</DialogTitle><DialogDescription>Used to group and filter blog posts.</DialogDescription></DialogHeader>
        <div className="flex gap-2"><Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && name && add()} /><Button onClick={add} disabled={!name}><Plus /> Add</Button></div>
        <div className="grid max-h-80 gap-2 overflow-y-auto">
          {(rows || []).map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-md border p-2">
              <Input defaultValue={c.name} className="h-8" onBlur={(e) => e.target.value !== c.name && e.target.value && patch(c, { name: e.target.value })} />
              <span className="text-muted-foreground w-14 text-xs">{c.posts_count} posts</span>
              <Switch checked={c.is_active} onCheckedChange={(v) => patch(c, { is_active: v })} aria-label="Active" />
              <Button size="icon" variant="ghost" onClick={() => del(c)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
            </div>
          ))}
          {rows && !rows.length && <p className="text-muted-foreground text-sm">No categories yet.</p>}
        </div>
        <DialogFooter><Button onClick={onClose}>Done</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Posts() {
  const nav = useNavigate();
  const [rows, setRows] = useState(null);
  const [type, setType] = useState('blog');
  const [q, setQ] = useState('');
  const [cats, setCats] = useState(false);
  const load = () => api('/posts').then(setRows);
  useEffect(() => { load(); }, []);

  const list = useMemo(() => (rows || []).filter((p) => p.type === type && (!q || `${p.title} ${p.category || ''}`.toLowerCase().includes(q.toLowerCase()))), [rows, type, q]);

  const del = async (p) => {
    if (!window.confirm(`Delete “${p.title}”?`)) return;
    try { await api(`/posts/${p.id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch (e) { toast.error(e.message); }
  };

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Blog & News" description="Write, edit and publish articles. Published posts appear on /blogs and /news.">
        <Button variant="outline" onClick={() => setCats(true)}><Tags /> Categories</Button>
        <Button onClick={() => nav(`/posts/new?type=${type}`)}><Plus /> New {type === 'news' ? 'news' : 'blog post'}</Button>
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={type} onValueChange={setType}><TabsList><TabsTrigger value="blog">Blog ({rows.filter((p) => p.type === 'blog').length})</TabsTrigger><TabsTrigger value="news">News ({rows.filter((p) => p.type === 'news').length})</TabsTrigger></TabsList></Tabs>
        <Input placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64 bg-white" />
      </div>
      <Card><CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead>{type === 'blog' && <TableHead>Category</TableHead>}<TableHead>Status</TableHead><TableHead>Published</TableHead><TableHead>Views</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-md truncate font-medium"><Link to={`/posts/${p.id}`} className="hover:underline">{p.title}</Link></TableCell>
                {type === 'blog' && <TableCell className="text-xs">{p.category || '—'}</TableCell>}
                <TableCell><Badge variant={statusBadge[p.status]}>{p.status}</Badge></TableCell>
                <TableCell className="text-xs whitespace-nowrap">{p.published_at ? p.published_at.slice(0, 10) : '—'}</TableCell>
                <TableCell className="text-xs">{p.views_count}</TableCell>
                <TableCell className="space-x-1 text-right whitespace-nowrap">
                  {p.status === 'published' && <Button asChild size="icon" variant="ghost" aria-label="View"><a href={`/${p.type === 'news' ? 'news' : 'blogs'}/${p.slug}`} target="_blank" rel="noreferrer"><Eye /></a></Button>}
                  <Button asChild size="sm" variant="outline"><Link to={`/posts/${p.id}`}><Pencil /> Edit</Link></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(p)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={6} className="text-muted-foreground py-8 text-center">No posts found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
      {cats && <CategoriesDialog onClose={() => setCats(false)} />}
    </>
  );
}
