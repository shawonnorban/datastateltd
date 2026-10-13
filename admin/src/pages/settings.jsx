import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import PageHeader from '@/components/page-header.jsx';
import Field from '@/components/field.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const emptyBranch = { name: '', address: '', phone: '', email: '' };

export default function Settings() {
  const [state, setState] = useState(null);
  const [values, setValues] = useState({});
  const [branches, setBranches] = useState([]);
  const [logo, setLogo] = useState(null);
  const [logo2, setLogo2] = useState(null);
  const [removeLogo2, setRemoveLogo2] = useState(false);
  const [banner, setBanner] = useState(null);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = (d) => { setState(d); setValues(d.values); setBranches(d.branches); setLogo(null); setLogo2(null); setRemoveLogo2(false); setBanner(null); setRemoveBanner(false); };
  useEffect(() => { api('/settings').then(load); }, []);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const setBranch = (i, k, v) => setBranches((b) => b.map((x, n) => (n === i ? { ...x, [k]: v } : x)));

  const save = async () => {
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ''));
      branches.forEach((b, i) => Object.entries(b).forEach(([k, v]) => fd.append(`branches[${i}][${k}]`, v ?? '')));
      if (!branches.length) fd.append('branches', '');
      if (logo) fd.append('logo', logo);
      if (logo2) fd.append('logo_scrolled', logo2);
      if (removeLogo2) fd.append('remove_logo_scrolled', '1');
      if (banner) fd.append('hero_banner', banner);
      if (removeBanner) fd.append('remove_hero_banner', '1');
      load(await api('/settings', { method: 'POST', form: fd }));
      toast.success('Settings saved');
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  if (!state) return <p className="text-muted-foreground">Loading…</p>;
  const text = (k, label, props = {}) => <Field label={label} htmlFor={k}><Input id={k} value={values[k] ?? ''} onChange={set(k)} {...props} /></Field>;

  return (
    <>
      <PageHeader title="Site Settings" description="Logo, contact details, social links and branches shown on the public website.">
        <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button>
      </PageHeader>
      <Tabs defaultValue="branding">
        <TabsList className="flex-wrap">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card><CardHeader><CardTitle>Branding</CardTitle><CardDescription>Name, logo and the hero banner image.</CardDescription></CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              {text('site_name', 'Site name')}
              {text('site_full_name', 'Full name')}
              <Field label="Tagline" className="md:col-span-2" htmlFor="tagline"><Input id="tagline" value={values.tagline ?? ''} onChange={set('tagline')} /></Field>
              <Field label="Logo 1 — top of the page" hint="Shown first, over the dark banner (use a light or white logo). It is shown in a 240×56 px area, so a wide logo (about 4:1) fits best. PNG, JPG, WebP or SVG, max 2 MB.">
                {state.logo_url && <div className="w-fit rounded-md bg-slate-900 p-3"><img src={state.logo_url} alt="Logo 1" className="max-h-14" /></div>}
                <Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0] || null)} />
              </Field>
              <Field label="Logo 2 — after scrolling" hint="Replaces logo 1 when the visitor scrolls down and the header turns white (use a dark or coloured logo). If empty, logo 1 is used.">
                {state.logo_scrolled_url && !removeLogo2 && <div className="w-fit rounded-md border bg-white p-3"><img src={state.logo_scrolled_url} alt="Logo 2" className="max-h-14" /></div>}
                <Input type="file" accept="image/*" onChange={(e) => { setLogo2(e.target.files[0] || null); setRemoveLogo2(false); }} />
                {state.logo_scrolled_url && !logo2 && <div className="flex items-center gap-2"><Switch id="rl2" checked={removeLogo2} onCheckedChange={setRemoveLogo2} /><Label htmlFor="rl2">Remove logo 2</Label></div>}
              </Field>
              <Field label="Hero banner image" hint="Background of the top banner on every page. PNG, JPG or WebP, max 4 MB.">
                {state.banner_url && !removeBanner && <img src={state.banner_url} alt="Banner" className="max-h-24 w-fit rounded-md" />}
                <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setBanner(e.target.files[0] || null)} />
                {state.banner_url && <div className="flex items-center gap-2"><Switch id="rb" checked={removeBanner} onCheckedChange={setRemoveBanner} /><Label htmlFor="rb">Remove current banner</Label></div>}
              </Field>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card><CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              {text('contact_phone', 'Phone')}
              {text('contact_whatsapp', 'WhatsApp number', { placeholder: '+8801XXXXXXXXX' })}
              {text('contact_email', 'Email', { type: 'email' })}
              <Field label="Google Maps link" hint="Paste any Google Maps link (share link, place link or embed URL). It is converted for the website map automatically." htmlFor="map_embed_url"><Input id="map_embed_url" value={values.map_embed_url ?? ''} onChange={set('map_embed_url')} placeholder="https://maps.app.goo.gl/..." /></Field>
              <Field label="Address" className="md:col-span-2" htmlFor="address"><Textarea id="address" rows={2} value={values.address ?? ''} onChange={set('address')} /></Field>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="social">
          <Card><CardHeader><CardTitle>Social links</CardTitle></CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              {text('facebook_url', 'Facebook', { placeholder: 'https://' })}
              {text('twitter_url', 'Twitter / X', { placeholder: 'https://' })}
              {text('linkedin_url', 'LinkedIn', { placeholder: 'https://' })}
              {text('youtube_url', 'YouTube', { placeholder: 'https://' })}
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card><CardHeader><CardTitle>Legal</CardTitle><CardDescription>Shown in the website footer.</CardDescription></CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field label="Legal info" hint="One line each. Certification logos are managed under Certifications." htmlFor="legal_info" className="md:col-span-2"><Textarea id="legal_info" rows={5} value={values.legal_info ?? ''} onChange={set('legal_info')} /></Field>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="branches">
          <Card><CardHeader><CardTitle>Branches</CardTitle><CardDescription>Office locations shown on the Contact page.</CardDescription></CardHeader>
            <CardContent className="grid gap-4">
              {branches.map((b, i) => (
                <div key={i} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_2fr_1fr_1fr_auto] md:items-end">
                  <Field label="Name"><Input value={b.name} onChange={(e) => setBranch(i, 'name', e.target.value)} /></Field>
                  <Field label="Address"><Input value={b.address} onChange={(e) => setBranch(i, 'address', e.target.value)} /></Field>
                  <Field label="Phone"><Input value={b.phone} onChange={(e) => setBranch(i, 'phone', e.target.value)} /></Field>
                  <Field label="Email"><Input value={b.email} onChange={(e) => setBranch(i, 'email', e.target.value)} /></Field>
                  <Button variant="ghost" size="icon" onClick={() => setBranches((x) => x.filter((_, n) => n !== i))} aria-label="Remove"><Trash2 className="text-destructive" /></Button>
                </div>
              ))}
              <Button variant="outline" className="w-fit" onClick={() => setBranches((x) => [...x, { ...emptyBranch }])}><Plus /> Add branch</Button>
            </CardContent></Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
