<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index()
    {
        return Inquiry::latest()->get();
    }

    public function update(Request $request, Inquiry $inquiry)
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,contacted,closed'],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ]);
        $inquiry->update($data + ['handled_at' => $data['status'] === 'new' ? null : now()]);

        return $inquiry;
    }
}
