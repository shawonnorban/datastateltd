<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jobs_board', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->string('company')->nullable();
            $table->string('location')->nullable();
            $table->string('employment_type', 80)->nullable();
            $table->string('experience_level', 80)->nullable();
            $table->string('salary')->nullable();
            $table->unsignedInteger('vacancies')->nullable();
            $table->date('deadline')->nullable();
            $table->text('summary')->nullable();
            $table->json('sections')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['is_active', 'deadline']);
        });

        Schema::table('job_applications', function (Blueprint $table) {
            $table->foreignId('job_id')->nullable()->after('id')->constrained('jobs_board')->nullOnDelete();
            $table->text('admin_notes')->nullable();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->string('type', 20)->default('blog')->after('id');
            $table->unsignedSmallInteger('read_minutes')->nullable();
            $table->index(['type', 'status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['type', 'status', 'published_at']);
            $table->dropColumn(['type', 'read_minutes']);
        });
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('job_id');
            $table->dropColumn('admin_notes');
        });
        Schema::dropIfExists('jobs_board');
    }
};
