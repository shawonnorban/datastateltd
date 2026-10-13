import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const money = (n) => (n == null || n === '' ? '—' : `৳${Number(n).toLocaleString()}`);
const blankPlan = { name: '', tagline: '', badge: '', discount_label: '', old_price_yearly: '', price_monthly: '', price_yearly: '', price_triennial: '', features: [], specs: {}, order_url: '', is_popular: false, is_active: true, sort_order: 0 };
const blankTld = { extension: '.', price: '', old_price: '', is_active: true, sort_order: 0 };

const specsToText = (s) => Object.entries(s || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
const textToSpecs = (t) => Object.fromEntries(t.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const i = l.indexOf(':'); return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const num = (v) => (v === '' || v == null ? null : Number(v));

function PlanDialog({ plan, onClose, onSaved }) {
  const [f, setF] = useState(plan);
  const [features, setFeatures] = useState((plan?.features || []).join('\n'));
  const [specs, setSpecs] = useState(specsToText(plan?.specs));
  const [busy, setBusy] = useState(false);
  useEffect(() => { setF(plan); setFeatures((plan?.features || []).join('\n')); setSpecs(specsToText(plan?.specs)); }, [plan]);
  if (!f) return null;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const save = async () => {
    setBusy(true);
    try {
      const body = {
        name: f.name, tagline: f.tagline || null, badge: f.badge || null, discount_label: f.discount_label || null,
        old_price_yearly: num(f.old_price_yearly), price_monthly: num(f.price_monthly), price_yearly: num(f.price_yearly), price_triennial: num(f.price_triennial),
        features: features.split('\n').map((l) => l.trim()).filter(Boolean), specs: textToSpecs(specs),
        order_url: f.order_url || null, is_popular: !!f.is_popular, is_active: !!f.is_active, sort_order: Number(f.sort_order) || 0,
      };
      await api(f.id ? `/plans/${f.id}` : '/plans', { method: f.id ? 'PUT' : 'POST', body });
      toast.success('Plan saved'); onSaved(); onClose();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader><DialogTitle>{f.id ? `Edit ${f.name}` : 'New hosting plan'}</DialogTitle><DialogDescription>Prices are in BDT (৳).</DialogDescription></DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Plan name"><Input value={f.name} onChange={set('name')} /></Field>
          <Field label="Tagline"><Input value={f.tagline ?? ''} onChange={set('tagline')} /></Field>
          <Field label="Monthly price"><Input type="number" value={f.price_monthly ?? ''} onChange={set('price_monthly')} /></Field>
          <Field label="Yearly price"><Input type="number" value={f.price_yearly ?? ''} onChange={set('price_yearly')} /></Field>
          <Field label="3-year price"><Input type="number" value={f.price_triennial ?? ''} onChange={set('price_triennial')} /></Field>
          <Field label="Old yearly price (strike-through)"><Input type="number" value={f.old_price_yearly ?? ''} onChange={set('old_price_yearly')} /></Field>
          <Field label="Discount label" hint="e.g. 70% OFF"><Input value={f.discount_label ?? ''} onChange={set('discount_label')} /></Field>
          <Field label="Badge" hint="e.g. Most Popular / Best Value"><Input value={f.badge ?? ''} onChange={set('badge')} /></Field>
          <Field label="Order button link" className="md:col-span-2" hint="URL or path opened by the Order Now button"><Input value={f.order_url ?? ''} onChange={set('order_url')} /></Field>
          <Field label="Included features" hint="One per line"><Textarea rows={8} value={features} onChange={(e) => setFeatures(e.target.value)} /></Field>
          <Field label="Specifications table" hint="One per line: Label: Value (same labels across plans)"><Textarea rows={8} value={specs} onChange={(e) => setSpecs(e.target.value)} className="font-mono text-xs" /></Field>
          <Field label="Sort order"><Input type="number" value={f.sort_order} onChange={set('sort_order')} /></Field>
          <div className="flex items-end gap-6 pb-2">
            <div className="flex items-center gap-2"><Switch id="pop" checked={!!f.is_popular} onCheckedChange={(v) => setF({ ...f, is_popular: v })} /><Label htmlFor="pop">Highlight</Label></div>
            <div className="flex items-center gap-2"><Switch id="act" checked={!!f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: v })} /><Label htmlFor="act">Active</Label></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save plan'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TldDialog({ tld, onClose, onSaved }) {
  const [f, setF] = useState(tld);
  const [busy, setBusy] = useState(false);
  useEffect(() => setF(tld), [tld]);
  if (!f) return null;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const save = async () => {
    setBusy(true);
    try {
      const body = { extension: f.extension.startsWith('.') ? f.extension : `.${f.extension}`, price: num(f.price), old_price: num(f.old_price), is_active: !!f.is_active, sort_order: Number(f.sort_order) || 0 };
      await api(f.id ? `/tlds/${f.id}` : '/tlds', { method: f.id ? 'PUT' : 'POST', body });
      toast.success('Domain saved'); onSaved(); onClose();
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{f.id ? `Edit ${f.extension}` : 'New domain extension'}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <Field label="Extension"><Input value={f.extension} onChange={set('extension')} placeholder=".com" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price / year (৳)"><Input type="number" value={f.price} onChange={set('price')} /></Field>
            <Field label="Old price (optional)"><Input type="number" value={f.old_price ?? ''} onChange={set('old_price')} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort order"><Input type="number" value={f.sort_order} onChange={set('sort_order')} /></Field>
            <div className="flex items-end gap-2 pb-2"><Switch id="tact" checked={!!f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: v })} /><Label htmlFor="tact">Active</Label></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={busy}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Hosting() {
  const [plans, setPlans] = useState(null);
  const [tlds, setTlds] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tld, setTld] = useState(null);
  const load = () => { api('/plans').then(setPlans); api('/tlds').then(setTlds); };
  useEffect(load, []);

  const del = async (kind, row) => {
    if (!window.confirm(`Delete ${row.name || row.extension}?`)) return;
    try { await api(`/${kind}/${row.id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch (e) { toast.error(e.message); }
  };

  if (!plans || !tlds) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <>
      <PageHeader title="Domain & Hosting" description="Hosting packages and domain prices shown on the /domain page. Page text is edited under Page Sections → domain." />
      <Tabs defaultValue="plans">
        <TabsList><TabsTrigger value="plans">Hosting plans</TabsTrigger><TabsTrigger value="tlds">Domain prices</TabsTrigger></TabsList>

        <TabsContent value="plans">
          <Card><CardContent>
            <div className="mb-4 flex justify-end"><Button onClick={() => setPlan({ ...blankPlan, sort_order: (plans.length + 1) * 10 })}><Plus /> Add plan</Button></div>
            <Table>
              <TableHeader><TableRow><TableHead>Plan</TableHead><TableHead>Monthly</TableHead><TableHead>Yearly</TableHead><TableHead>3 years</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name} {p.is_popular && <Badge className="ml-1">{p.badge || 'Highlight'}</Badge>}<div className="text-muted-foreground text-xs">{p.tagline}</div></TableCell>
                    <TableCell>{money(p.price_monthly)}</TableCell><TableCell>{money(p.price_yearly)}</TableCell><TableCell>{money(p.price_triennial)}</TableCell>
                    <TableCell>{p.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                    <TableCell className="space-x-1 text-right whitespace-nowrap">
                      <Button size="sm" variant="outline" onClick={() => setPlan(p)}><Pencil /> Edit</Button>
                      <Button size="icon" variant="ghost" onClick={() => del('plans', p)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="tlds">
          <Card><CardContent>
            <div className="mb-4 flex justify-end"><Button onClick={() => setTld({ ...blankTld, sort_order: (tlds.length + 1) * 10 })}><Plus /> Add extension</Button></div>
            <Table>
              <TableHeader><TableRow><TableHead>Extension</TableHead><TableHead>Price / year</TableHead><TableHead>Old price</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {tlds.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono font-medium">{t.extension}</TableCell><TableCell>{money(t.price)}</TableCell><TableCell>{money(t.old_price)}</TableCell>
                    <TableCell>{t.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                    <TableCell className="space-x-1 text-right whitespace-nowrap">
                      <Button size="sm" variant="outline" onClick={() => setTld(t)}><Pencil /> Edit</Button>
                      <Button size="icon" variant="ghost" onClick={() => del('tlds', t)} aria-label="Delete"><Trash2 className="text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
      {plan && <PlanDialog plan={plan} onClose={() => setPlan(null)} onSaved={load} />}
      {tld && <TldDialog tld={tld} onClose={() => setTld(null)} onSaved={load} />}
    </>
  );
}
