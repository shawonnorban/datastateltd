<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Throwable;

/**
 * Google Maps share links (maps.app.goo.gl/..., google.com/maps/place/...) refuse to be
 * shown inside an iframe. This turns any Maps link into an embeddable URL.
 */
class MapEmbed
{
    public static function isEmbeddable(?string $url): bool
    {
        return (bool) $url && (str_contains($url, 'output=embed') || str_contains($url, '/maps/embed'));
    }

    /** Embeddable URL for a pasted link, falling back to the address, or null when nothing works. */
    public static function from(?string $link, ?string $address = null): ?string
    {
        $link = trim((string) $link);

        if ($link !== '' && self::isEmbeddable($link)) {
            return $link;
        }

        if ($link !== '') {
            $final = self::resolve($link);
            if ($query = self::queryFrom($final) ?? self::queryFrom($link)) {
                return self::embed($query);
            }
        }

        $address = trim((string) $address);

        return $address !== '' ? self::embed($address) : null;
    }

    public static function embed(string $query): string
    {
        return 'https://maps.google.com/maps?q='.rawurlencode($query).'&z=16&hl=en&output=embed';
    }

    /** Follow redirects (short links) and return the final URL. */
    public static function resolve(string $url): string
    {
        if (! preg_match('#^https?://#i', $url)) {
            return $url;
        }

        try {
            $final = $url;
            Http::timeout(8)
                ->withOptions(['on_stats' => function ($stats) use (&$final) {
                    $final = (string) $stats->getEffectiveUri();
                }])
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; MapEmbed/1.0)'])
                ->get($url);

            return $final;
        } catch (Throwable) {
            return $url;
        }
    }

    /** Pull "lat,lng" or a place name out of a full Google Maps URL. */
    public static function queryFrom(string $url): ?string
    {
        $url = urldecode($url);

        if (preg_match('/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/', $url, $m)) {
            return "{$m[1]},{$m[2]}";
        }
        if (preg_match('/@(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $m)) {
            return "{$m[1]},{$m[2]}";
        }
        if (preg_match('/[?&](?:q|query|destination)=([^&]+)/', $url, $m)) {
            return str_replace('+', ' ', $m[1]);
        }
        if (preg_match('#/maps/place/([^/@?]+)#', $url, $m)) {
            return str_replace('+', ' ', $m[1]);
        }

        return null;
    }
}
