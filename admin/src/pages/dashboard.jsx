import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Briefcase, LayoutTemplate, Server } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api('/dashboard').then(setData); }, []);
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const s = data.stats;
  const cards = [
    { label: 'New inquiries', value: s.new_inquiries, sub: `${s.inquiries} total`, icon: Inbox, to: '/inquiries' },
    { label: 'New applications', value: s.new_applications, sub: `${s.applications} total`, icon: Briefcase, to: '/applications' },
    { label: 'Page sections', value: s.sections, sub: 'editable content blocks', icon: LayoutTemplate, to: '/sections' },
    { label: 'Hosting plans', value: s.plans, sub: `${s.tlds} domain extensions`, icon: Server, to: '/hosting' },
  ];
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your website" />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, sub, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="gap-2 py-5 transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between">
                <CardDescription>{label}</CardDescription><Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{value}</div><p className="text-muted-foreground text-xs">{sub}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent inquiries</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.recent_inquiries.map((i) => (
                  <TableRow key={i.id}><TableCell>{i.name}<div className="text-muted-foreground text-xs">{i.email}</div></TableCell><TableCell>{i.subject}</TableCell><TableCell><Badge variant={i.status === 'new' ? 'warning' : 'secondary'}>{i.status}</Badge></TableCell><TableCell>{fmt(i.created_at)}</TableCell></TableRow>
                ))}
                {!data.recent_inquiries.length && <TableRow><TableCell colSpan={4} className="text-muted-foreground py-6 text-center">No inquiries yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent job applications</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Applicant</TableHead><TableHead>Position</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.recent_applications.map((a) => (
                  <TableRow key={a.id}><TableCell>{a.name}</TableCell><TableCell className="max-w-48 truncate">{a.position}</TableCell><TableCell><Badge variant={a.status === 'new' ? 'warning' : 'secondary'}>{a.status}</Badge></TableCell><TableCell>{fmt(a.created_at)}</TableCell></TableRow>
                ))}
                {!data.recent_applications.length && <TableRow><TableCell colSpan={4} className="text-muted-foreground py-6 text-center">No applications yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
