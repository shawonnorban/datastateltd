<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DomainTld;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TldController extends Controller
{
    private function rules(?DomainTld $tld = null): array
    {
        return [
            'extension' => ['required', 'string', 'max:40', Rule::unique('domain_tlds', 'extension')->ignore($tld?->id)],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }

    public function index()
    {
        return DomainTld::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        return response(DomainTld::create($request->validate($this->rules())), 201);
    }

    public function update(Request $request, DomainTld $tld)
    {
        $tld->update($request->validate($this->rules($tld)));

        return $tld;
    }

    public function destroy(DomainTld $tld)
    {
        $tld->delete();

        return response()->noContent();
    }
}
