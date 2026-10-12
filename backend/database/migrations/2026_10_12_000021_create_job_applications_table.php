<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->string('position');
            $table->string('name', 120);
            $table->string('email', 190);
            $table->string('phone', 30);
            $table->text('cover_note')->nullable();
            $table->string('cv_path');
            $table->string('cv_original_name')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
