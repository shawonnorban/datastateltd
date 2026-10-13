import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Sections() {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState('');
  useEffect(() => { api('/sections').then(setRows); }, []);

  const groups = useMemo(() => {
    const m = new Map();
    (rows || []).filter((r) => !q || `${r.page} ${r.title} ${r.type}`.toLowerCase().includes(q.toLowerCase()))
      .forEach((r) => m.set(r.page, [...(m.get(r.page) || []), r]));
    return [...m.entries()];
  }, [rows, q]);

  if (!rows) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Page Sections" description="Edit the content blocks shown on each public page.">
        <Input placeholder="Search pages or sections…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64 bg-white" />
      </PageHeader>
      <div className="grid gap-5">
        {groups.map(([page, list]) => (
          <Card key={page}>
            <CardHeader><CardTitle className="font-mono text-base">/{page === 'home' ? '' : page}</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>Type</TableHead><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                <TableBody>
                  {list.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.sort_order}</TableCell>
                      <TableCell><Badge variant="outline">{s.type}</Badge></TableCell>
                      <TableCell className="max-w-md truncate">{s.title || <span className="text-muted-foreground">{s.key}</span>}</TableCell>
                      <TableCell>{s.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                      <TableCell className="text-right"><Button asChild size="sm" variant="outline"><Link to={`/sections/${s.id}`}><Pencil /> Edit</Link></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
        {!groups.length && <p className="text-muted-foreground">No sections match.</p>}
      </div>
    </>
  );
}
