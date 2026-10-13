<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HostingPlan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:80'],
            'discount_label' => ['nullable', 'string', 'max:40'],
            'old_price_yearly' => ['nullable', 'numeric', 'min:0'],
            'price_monthly' => ['nullable', 'numeric', 'min:0'],
            'price_yearly' => ['nullable', 'numeric', 'min:0'],
            'price_triennial' => ['nullable', 'numeric', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'specs' => ['nullable', 'array'],
            'order_url' => ['nullable', 'string', 'max:500'],
            'is_popular' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ];
    }

    public function index()
    {
        return HostingPlan::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        return response(HostingPlan::create($request->validate($this->rules())), 201);
    }

    public function update(Request $request, HostingPlan $plan)
    {
        $plan->update($request->validate($this->rules()));

        return $plan;
    }

    public function destroy(HostingPlan $plan)
    {
        $plan->delete();

        return response()->noContent();
    }
}
