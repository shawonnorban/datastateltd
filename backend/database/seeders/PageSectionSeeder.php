<?php

namespace Database\Seeders;

use App\Models\PageSection;
use Illuminate\Database\Seeder;

/**
 * Loads public page content from data/erp_pages.json. Uses firstOrCreate on a
 * stable key, so edits made in the admin panel are never overwritten.
 */
class PageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $file = database_path('seeders/data/erp_pages.json');
        $data = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);

        foreach ($data['pages'] as $slug => $page) {
            foreach ($page['sections'] as $i => $s) {
                $key = $slug.'-'.($s['key'] ?? $s['type'].'-'.($i + 1));

                PageSection::firstOrCreate(['key' => $key], [
                    'page' => $slug,
                    'type' => $s['type'],
                    'eyebrow' => $s['eyebrow'] ?? null,
                    'title' => $s['title'] ?? null,
                    'subtitle' => $s['subtitle'] ?? null,
                    'data' => $s['data'] ?? null,
                    'is_active' => true,
                    'sort_order' => ($i + 1) * 10,
                ]);
            }
        }
    }
}
