'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'

export type Language = 'en' | 'id' | 'ar' | 'es'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  formatNumber: (value: number | string | null | undefined) => string
  formatDate: (date?: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
  isRTL: boolean
}

export function formatNumberByLang(
  value: number | string | null | undefined,
  lang: Language = 'en'
): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (lang === 'ar') {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return str
      .replace(/[0-9]/g, (d) => arabicDigits[Number(d)])
      .replace(/,/g, '،')
      .replace(/%/g, '٪')
  }
  return str
}

export function formatDateByLang(
  date: Date | string | number = new Date(),
  lang: Language = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    id: 'id-ID',
    ar: 'ar-EG',
    es: 'es-ES'
  }
  const defaultOptions: Intl.DateTimeFormatOptions = options || {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  try {
    const formatted = new Intl.DateTimeFormat(localeMap[lang] || 'en-US', defaultOptions).format(d)
    return formatNumberByLang(formatted, lang)
  } catch {
    return d.toDateString()
  }
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Sidebar
    dashboard: 'Executive Dashboard',
    products: 'Product Catalog',
    production_logs: 'Production Logs',
    inventory: 'Inventory & Stock',
    reports: 'Reports & Analytics',
    users: 'User Access & Roles',
    settings: 'System Settings',
    help: 'Help Center',
    logout: 'Sign Out',
    main_menu: 'Main Navigation',
    enterprise_automation: 'Enterprise Automation',

    // Dashboard Page
    executive_dashboard: 'Executive Dashboard',
    smart_control: 'Smart Automation',
    realtime_overview: 'Real-time overview of global manufacturing operations & inventory.',
    refresh: 'Sync Live Data',
    sync_data: 'Sync Data',

    // Header & Quick Actions
    search_placeholder: 'Search operations, products, logs...',
    export: 'Export Data',
    new_action: 'Quick Action',
    add_new_product: '+ Add New Product',
    record_production: 'Record Production',
    record_stock_out: 'Record Stock Out',

    // KPI Summary Cards
    total_products: 'Total Products',
    today_production: "Today's Production",
    current_inventory: 'Current Stock Level',
    low_stock_alerts: 'Low Stock Alerts',
    production_efficiency: 'Line Efficiency (OEE)',
    active_catalog: 'Active catalog items',
    vs_daily_target: 'vs daily target',
    total_items_in_stock: 'Total items in stock',
    require_attention: 'Items require attention',
    optimal_output: 'Optimal line output',

    // Dashboard widgets
    recent_activity: 'Live Production Stream',
    stock_status: 'Inventory Levels & Safety',
    quick_stats: 'Operational Summary',
    view_all_logs: 'View Complete Audit Logs',
    manage_inventory: 'Open Inventory Management',

    // Stock levels
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Critical',
    units_left: 'units remaining',

    // Forms and Modals
    add_product_title: 'Create Catalog Product',
    edit_product_title: 'Modify Catalog Product',
    product_name: 'Product Name',
    unit: 'Unit of Measure',
    min_stock: 'Safety Stock Threshold',
    current_stock: 'Current Stock Quantity',
    save_product: 'Save Product',
    saving: 'Processing...',
    confirm_delete: 'Are you sure you want to delete this record?',
    delete_warning: 'This action is irreversible and will remove associated telemetry logs.',

    // Common
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back to Dashboard',
    sign_in: 'Sign In to Control Center',
    username: 'Username / Operator ID',
    password: 'Password',
    login: 'Authenticate Session',
    logging_in: 'Authenticating...',
    login_subtitle: 'Enter your credentials to access industrial control systems.',

    // Settings Module Full Localization
    system_settings: 'System Settings',
    system_config: 'Industrial Control Config',
    settings_description: 'Manage platform preferences, security, notification rules, and industrial system connectivity.',
    search_settings: 'Search settings...',
    language: 'Language',
    select_language: 'Interface Language',
    language_subtitle: 'Select your preferred language for the industrial control dashboard.',
    preview_format: 'Live Format Preview',
    appearance: 'Visual Appearance',
    appearance_subtitle: 'Customize theme contrast, interface density, and visual telemetry styling.',
    theme: 'Theme Mode',
    theme_dark: 'Forge Dark (Recommended for Control Rooms)',
    theme_light: 'Clean Slate Light',
    high_contrast: 'High Contrast Mode',
    high_contrast_desc: 'Enhances visibility in high-glare or industrial factory floor environments.',
    ui_density: 'Interface Density',
    density_comfortable: 'Comfortable (Standard Touch/Desktop)',
    density_compact: 'Compact (High-Density Telemetry)',
    accent_color: 'Telemetry Accent Color',
    accent_blue: 'Forge Blue',
    accent_emerald: 'Emerald Automation',
    accent_amber: 'Cyber Amber',
    accent_violet: 'Tech Violet',
    profile: 'User Profile',
    profile_info: 'Operator Profile & Identity',
    profile_subtitle: 'Manage your operator identity, contact details, and factory terminal preferences.',
    full_name: 'Full Name',
    department: 'Department / Unit',
    job_title: 'Job Title',
    phone_number: 'Contact Phone',
    timezone: 'Terminal Timezone',
    save_profile: 'Save Profile Changes',
    profile_updated: 'Profile preferences updated successfully.',
    security: 'Security & Access',
    security_title: 'Security & Authentication',
    security_subtitle: 'Manage authentication credentials, two-factor verification, and active workstations.',
    update_password: 'Update Password',
    current_password: 'Current Password',
    new_password: 'New Password',
    confirm_password: 'Confirm New Password',
    password_updated: 'Password has been updated successfully.',
    two_factor_auth: 'Two-Factor Authentication (2FA)',
    two_factor_desc: 'Enforce hardware security key or TOTP authenticator app for critical control actions.',
    two_factor_status_active: '2FA is Active & Protected',
    two_factor_status_inactive: '2FA Inactive (Disabled)',
    two_factor_setup_btn: 'Configure 2FA',
    two_factor_disable_btn: 'Disable 2FA',
    two_factor_modal_title: 'Two-Factor Authentication Setup (TOTP)',
    two_factor_step_1: '1. Scan QR Code in Authenticator App',
    two_factor_step_1_desc: 'Scan this QR code with Google Authenticator, Microsoft Authenticator, Apple Passwords, or 1Password.',
    two_factor_manual_key: 'Manual Secret Key',
    two_factor_copy_key: 'Copy Key',
    two_factor_copied: 'Copied!',
    two_factor_step_2: '2. Save Emergency Recovery Codes',
    two_factor_step_2_desc: 'Save these 8 single-use recovery codes in a safe place. You can use them to log in if you lose your device.',
    two_factor_step_3: '3. Verify 6-Digit TOTP Code',
    two_factor_verify_btn: 'Verify & Activate 2FA',
    two_factor_enabled_toast: 'Two-Factor Authentication is now active!',
    two_factor_disabled_toast: 'Two-Factor Authentication has been disabled.',
    two_factor_login_title: 'Two-Factor Authentication (2FA)',
    two_factor_login_prompt: 'Enter the 6-digit verification code from your authenticator app or enter a single-use backup recovery code.',
    two_factor_verify_login_btn: 'Verify & Sign In',
    active_sessions: 'Active Factory Workstations',
    revoke_other_sessions: 'Terminate Other Sessions',
    session_revoked: 'All other active sessions have been terminated.',
    notifications: 'Notifications',
    notification_rules: 'Alert & Notification Rules',
    notification_rules_desc: 'Configure alert triggers, escalation thresholds, and delivery channels for shop floor events.',
    channel_in_app: 'In-App Alerts',
    channel_email: 'Email Digest',
    channel_audio: 'Audible Siren Alert',
    alert_low_stock: 'Low Stock Safety Alerts',
    alert_maintenance: 'Machine Maintenance Reminders (500h)',
    alert_shift_batch: 'Shift Production Output Summaries',
    alert_db_sync: 'Database Sync & Latency Warnings',
    save_notifications: 'Save Notification Rules',
    notifications_saved: 'Notification rules updated successfully.',
    system: 'System Infrastructure',
    system_infra: 'System Infrastructure & Database',
    system_infra_desc: 'Manage Go API backend connections, MSSQL cluster synchronization, and database backups.',
    backend_api_url: 'Backend Go API Gateway URL',
    mssql_db_host: 'MSSQL Database Host & Catalog',
    auto_sync_interval: 'Auto-Sync Polling Interval',
    default_export_format: 'Default Export Format',
    telemetry_log_level: 'Telemetry Log Level',
    trigger_backup: 'Trigger Manual Database Backup',
    save_preferences: 'Save Configuration',
    system_config_saved: 'System infrastructure configuration saved.',

    // Table headers & Details
    product_code: 'Code',
    category: 'Category',
    stock: 'Stock',
    min: 'Min',
    shift: 'Shift',
    operator: 'Operator',
    machine_id: 'Machine ID',
    quantity: 'Quantity',
    status: 'Status',
    last_activity: 'Last Activity',
    actions: 'Actions',
    role: 'Role',
    user: 'User',
    last_login: 'Last Login',
    active_status_label: 'Active',
    admin: 'Admin',
    supervisor: 'Supervisor',
    operator_text: 'Operator',

    // Units & Measures
    units: 'units',
    pcs: 'pcs',
    produce: 'Produce',
    view_all: 'View All',
    showing: 'Showing',
    of: 'of',
    loading: 'Loading...',

    // Timeframes & Days
    tf_7d: '7D',
    tf_30d: '30D',
    tf_ytd: 'YTD',
    days_mon: 'Mon',
    days_tue: 'Tue',
    days_wed: 'Wed',
    days_thu: 'Thu',
    days_fri: 'Fri',
    days_sat: 'Sat',
    days_sun: 'Sun',

    // Buttons
    save: 'Save Product',
    submit: 'Submit',
    view: 'View',
    interface_language: 'Interface Language',
  },
  id: {
    // Navigasi & Sidebar
    dashboard: 'Dasbor Eksekutif',
    products: 'Katalog Produk',
    production_logs: 'Catatan Produksi',
    inventory: 'Inventaris & Stok',
    reports: 'Laporan & Analitik',
    users: 'Akses & Peran Pengguna',
    settings: 'Pengaturan Sistem',
    help: 'Pusat Bantuan',
    logout: 'Keluar',
    main_menu: 'Navigasi Utama',
    enterprise_automation: 'Otomasi Industri',

    // Halaman Dashboard
    executive_dashboard: 'Dasbor Eksekutif',
    smart_control: 'Otomasi Pintar',
    realtime_overview: 'Pemantauan operasional manufaktur & inventaris pabrik secara real-time.',
    refresh: 'Sinkronkan Data Live',
    sync_data: 'Sinkronkan Data',

    // Header & Quick Actions
    search_placeholder: 'Cari operasional, produk, log...',
    export: 'Ekspor Data',
    new_action: 'Aksi Cepat',
    add_new_product: '+ Tambah Produk Baru',
    record_production: 'Catat Produksi',
    record_stock_out: 'Catat Stok Keluar',

    // KPI Cards
    total_products: 'Total Produk',
    today_production: 'Produksi Hari Ini',
    current_inventory: 'Tingkat Stok Saat Ini',
    low_stock_alerts: 'Peringatan Stok Rendah',
    production_efficiency: 'Efisiensi Jalur (OEE)',
    active_catalog: 'Item katalog aktif',
    vs_daily_target: 'vs target harian',
    total_items_in_stock: 'Total item dalam stok',
    require_attention: 'Item butuh perhatian',
    optimal_output: 'Keluaran lini optimal',

    // Dashboard widgets
    recent_activity: 'Aktivitas Produksi Langsung',
    stock_status: 'Tingkat Stok & Keamanan',
    quick_stats: 'Ringkasan Operasional',
    view_all_logs: 'Lihat Semua Log Audit',
    manage_inventory: 'Buka Manajemen Stok',

    // Stock levels
    in_stock: 'Stok Aman',
    low_stock: 'Stok Menipis',
    out_of_stock: 'Kritis',
    units_left: 'unit tersisa',

    // Forms and Modals
    add_product_title: 'Tambah Produk Baru',
    edit_product_title: 'Ubah Data Produk',
    product_name: 'Nama Produk',
    unit: 'Satuan Ukuran',
    min_stock: 'Batas Minimum Stok',
    current_stock: 'Jumlah Stok Saat Ini',
    save_product: 'Simpan Produk',
    saving: 'Menyimpan...',
    confirm_delete: 'Apakah Anda yakin ingin menghapus data ini?',
    delete_warning: 'Tindakan ini tidak dapat dibatalkan dan akan menghapus catatan telemetri terkait.',

    // Common
    success: 'Berhasil',
    error: 'Terjadi Kesalahan',
    warning: 'Peringatan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    back: 'Kembali ke Dasbor',
    sign_in: 'Masuk ke Pusat Kontrol',
    username: 'Nama Pengguna / ID Operator',
    password: 'Kata Sandi',
    login: 'Masuk ke Sistem',
    logging_in: 'Memverifikasi...',
    login_subtitle: 'Masukkan kredensial Anda untuk mengakses sistem otomasi industri.',

    // Settings Module Full Localization
    system_settings: 'Pengaturan Sistem',
    system_config: 'Konfigurasi Kontrol Industri',
    settings_description: 'Kelola preferensi platform, keamanan akun, aturan notifikasi, dan konektivitas infrastruktur pabrik.',
    search_settings: 'Cari pengaturan...',
    language: 'Bahasa',
    select_language: 'Bahasa Antarmuka',
    language_subtitle: 'Pilih bahasa antarmuka untuk panel kontrol industri.',
    preview_format: 'Pratinjau Format Langsung',
    appearance: 'Tampilan Visual',
    appearance_subtitle: 'Sesuaikan kontras tema, kepadatan antarmuka, dan gaya visual telemetri.',
    theme: 'Mode Tema',
    theme_dark: 'Forge Gelap (Disarankan untuk Ruang Kontrol)',
    theme_light: 'Clean Slate Terang',
    high_contrast: 'Mode Kontras Tinggi',
    high_contrast_desc: 'Meningkatkan keterbacaan pada area pabrik dengan pencahayaan silau atau ekstrem.',
    ui_density: 'Kepadatan Antarmuka',
    density_comfortable: 'Standar (Sentuh / Desktop Luas)',
    density_compact: 'Kompak (Telemetri Kerapatan Tinggi)',
    accent_color: 'Warna Aksen Telemetri',
    accent_blue: 'Forge Blue',
    accent_emerald: 'Emerald Automation',
    accent_amber: 'Cyber Amber',
    accent_violet: 'Tech Violet',
    profile: 'Profil Pengguna',
    profile_info: 'Profil & Identitas Operator',
    profile_subtitle: 'Kelola identitas operator, informasi kontak, dan workstation pabrik Anda.',
    full_name: 'Nama Lengkap',
    department: 'Departemen / Divisi',
    job_title: 'Jabatan / Posisi',
    phone_number: 'Nomor Telepon',
    timezone: 'Zona Waktu Terminal',
    save_profile: 'Simpan Perubahan Profil',
    profile_updated: 'Preferensi profil berhasil diperbarui.',
    security: 'Keamanan & Sandi',
    security_title: 'Keamanan & Akses Autentikasi',
    security_subtitle: 'Kelola kredensial akses, verifikasi dua langkah, dan workstation yang sedang aktif.',
    update_password: 'Perbarui Kata Sandi',
    current_password: 'Kata Sandi Saat Ini',
    new_password: 'Kata Sandi Baru',
    confirm_password: 'Konfirmasi Kata Sandi Baru',
    password_updated: 'Kata sandi berhasil diperbarui.',
    two_factor_auth: 'Autentikasi Dua Faktor (2FA)',
    two_factor_desc: 'Wajibkan kunci keamanan perangkat keras atau aplikasi TOTP untuk tindakan kritis.',
    two_factor_status_active: '2FA Aktif & Terlindungi',
    two_factor_status_inactive: '2FA Nonaktif',
    two_factor_setup_btn: 'Konfigurasi 2FA',
    two_factor_disable_btn: 'Nonaktifkan 2FA',
    two_factor_modal_title: 'Pengaturan Autentikasi Dua Faktor (TOTP)',
    two_factor_step_1: '1. Pindai QR Code di Aplikasi Authenticator',
    two_factor_step_1_desc: 'Pindai QR code ini menggunakan Google Authenticator, Microsoft Authenticator, Apple Passwords, atau 1Password.',
    two_factor_manual_key: 'Kunci Rahasia Manual',
    two_factor_copy_key: 'Salin Kunci',
    two_factor_copied: 'Tersalin!',
    two_factor_step_2: '2. Simpan Kode Pemulihan Darurat',
    two_factor_step_2_desc: 'Simpan 8 kode pemulihan sekali-pakai ini di tempat yang aman. Anda dapat menggunakannya untuk login jika perangkat hilang.',
    two_factor_step_3: '3. Verifikasi Kode TOTP 6-Digit',
    two_factor_verify_btn: 'Verifikasi & Aktifkan 2FA',
    two_factor_enabled_toast: 'Autentikasi Dua Faktor berhasil diaktifkan!',
    two_factor_disabled_toast: 'Autentikasi Dua Faktor telah dinonaktifkan.',
    two_factor_login_title: 'Verifikasi Dua Faktor (2FA)',
    two_factor_login_prompt: 'Masukkan kode verifikasi 6-digit dari aplikasi authenticator atau masukkan kode pemulihan cadangan.',
    two_factor_verify_login_btn: 'Verifikasi & Masuk',
    active_sessions: 'Sesi Workstation Aktif',
    revoke_other_sessions: 'Putuskan Sesi Lain',
    session_revoked: 'Semua sesi workstation lain berhasil diputuskan.',
    notifications: 'Notifikasi Sistem',
    notification_rules: 'Aturan Peringatan & Notifikasi',
    notification_rules_desc: 'Konfigurasikan ambang batas peringatan, eskalasi, dan saluran pengiriman peristiwa lantai pabrik.',
    channel_in_app: 'Peringatan Dalam Aplikasi',
    channel_email: 'Ringkasan Email',
    channel_audio: 'Peringatan Sirene Suara',
    alert_low_stock: 'Peringatan Batas Aman Stok Rendah',
    alert_maintenance: 'Peringatan Pemeliharaan Berkala Mesin (500 Jam)',
    alert_shift_batch: 'Laporan Output Produksi Batch Shift',
    alert_db_sync: 'Peringatan Sinkronisasi Basis Data & Latensi',
    save_notifications: 'Simpan Aturan Notifikasi',
    notifications_saved: 'Aturan notifikasi berhasil disimpan.',
    system: 'Konfigurasi Sistem',
    system_infra: 'Infrastruktur Sistem & Basis Data',
    system_infra_desc: 'Kelola koneksi API gateway Go, sinkronisasi cluster MSSQL, dan pencadangan data.',
    backend_api_url: 'URL Gateway API Backend Go',
    mssql_db_host: 'Host Basis Data & Katalog MSSQL',
    auto_sync_interval: 'Interval Sinkronisasi Otomatis',
    default_export_format: 'Format Standar Ekspor',
    telemetry_log_level: 'Tingkat Pencatatan Log Telemetri',
    trigger_backup: 'Jalankan Pencadangan Database Manual',
    save_preferences: 'Simpan Konfigurasi',
    system_config_saved: 'Konfigurasi infrastruktur sistem berhasil disimpan.',

    // Table headers
    product_code: 'Kode',
    category: 'Kategori',
    stock: 'Stok',
    min: 'Min',
    shift: 'Giliran (Shift)',
    operator: 'Operator',
    machine_id: 'ID Mesin',
    quantity: 'Jumlah',
    status: 'Status',
    last_activity: 'Aktivitas Terakhir',
    actions: 'Aksi',
    role: 'Peran',
    user: 'Pengguna',
    last_login: 'Login Terakhir',
    active_status_label: 'Aktif',
    admin: 'Admin',
    supervisor: 'Supervisor',
    operator_text: 'Operator',

    // Units & Measures
    units: 'unit',
    pcs: 'pcs',
    produce: 'Produksi',
    view_all: 'Lihat Semua',
    showing: 'Menampilkan',
    of: 'dari',
    loading: 'Memuat...',

    // Timeframes & Days
    tf_7d: '7H',
    tf_30d: '30H',
    tf_ytd: 'YTD',
    days_mon: 'Sen',
    days_tue: 'Sel',
    days_wed: 'Rab',
    days_thu: 'Kam',
    days_fri: 'Jum',
    days_sat: 'Sab',
    days_sun: 'Min',

    // Buttons
    save: 'Simpan Produk',
    submit: 'Kirim',
    view: 'Lihat',
    interface_language: 'Bahasa Antarmuka',
  },
  ar: {
    // Navigation & Sidebar
    dashboard: 'لوحة التحكم التنفيذية',
    products: 'كتالوج المنتجات',
    production_logs: 'سجلات الإنتاج',
    inventory: 'المخزون والمستودع',
    reports: 'التقارير والتحليلات',
    users: 'صلاحيات وأدوار المستخدمين',
    settings: 'إعدادات النظام',
    help: 'مركز المساعدة',
    logout: 'تسجيل الخروج',
    main_menu: 'القائمة الرئيسية',
    enterprise_automation: 'الأتمتة الصناعية',

    // Dashboard Page
    executive_dashboard: 'لوحة التحكم التنفيذية',
    smart_control: 'التحكم الذكي',
    realtime_overview: 'نظرة عامة ومباشرة على عمليات التصنيع والمخزون في الوقت الفعلي.',
    refresh: 'تحديث البيانات المباشرة',
    sync_data: 'مزامنة البيانات',

    // Header & Quick Actions
    search_placeholder: 'ابحث في العمليات، المنتجات، السجلات...',
    export: 'تصدير البيانات',
    new_action: 'إجراء سريع',
    add_new_product: '+ إضافة منتج جديد',
    record_production: 'تسجيل إنتاج',
    record_stock_out: 'تسجيل صرف مخزون',

    // KPI Summary Cards
    total_products: 'إجمالي المنتجات',
    today_production: 'إنتاج اليوم',
    current_inventory: 'مستوى المخزون الحالي',
    low_stock_alerts: 'تنبيهات انخفاض المخزون',
    production_efficiency: 'كفاءة الخط (OEE)',
    active_catalog: 'عناصر الكتالوج النشطة',
    vs_daily_target: 'مقارنة بالهدف اليومي',
    total_items_in_stock: 'إجمالي العناصر بالمستودع',
    require_attention: 'عناصر تتطلب تدخلاً',
    optimal_output: 'إنتاجية الخط المثالية',

    // Dashboard widgets
    recent_activity: 'بث الإنتاج المباشر',
    stock_status: 'مستويات المخزون والسلامة',
    quick_stats: 'ملخص العمليات التشغيلية',
    view_all_logs: 'عرض كامل سجلات التدقيق',
    manage_inventory: 'فتح إدارة المخزون',

    // Stock levels
    in_stock: 'متوفر وآمن',
    low_stock: 'مخزون منخفض',
    out_of_stock: 'مستوى حرج',
    units_left: 'وحدة متبقية',

    // Forms and Modals
    add_product_title: 'إضافة منتج جديد للكتالوج',
    edit_product_title: 'تعديل بيانات المنتج',
    product_name: 'اسم المنتج',
    unit: 'وحدة القياس',
    min_stock: 'حد المخزون الآمن',
    current_stock: 'كمية المخزون الحالية',
    save_product: 'حفظ المنتج',
    saving: 'جاري الحفظ...',
    confirm_delete: 'هل أنت متأكد من حذف هذا السجل؟',
    delete_warning: 'لا يمكن التراجع عن هذا الإجراء وسيتم حذف سجلات القياس المرتبطة به نهائياً.',

    // Common
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    warning: 'تحذير',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    back: 'العودة إلى لوحة التحكم',
    sign_in: 'تسجيل الدخول إلى مركز التحكم',
    username: 'اسم المستخدم / معرّف المشغل',
    password: 'كلمة المرور',
    login: 'توثيق الجلسة',
    logging_in: 'جاري التحقق...',
    login_subtitle: 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى أنظمة التحكم الصناعية.',

    // Settings Module Full Localization
    system_settings: 'إعدادات النظام',
    system_config: 'تكوين التحكم الصناعي',
    settings_description: 'إدارة تفضيلات المنصة والأمان وقواعد التنبيهات والاتصال بالبنية التحتية.',
    search_settings: 'البحث في الإعدادات...',
    language: 'اللغة',
    select_language: 'لغة الواجهة',
    language_subtitle: 'حدد اللغة المفضلة للوحة التحكم الصناعية.',
    preview_format: 'معاينة التنسيق المباشر',
    appearance: 'المظهر المرئي',
    appearance_subtitle: 'تخصيص تباين السمة وكثافة الواجهة ونمط القياس عن بُعد.',
    theme: 'وضع السمة',
    theme_dark: 'فورج داكن (موصى به لغرف التحكم)',
    theme_light: 'لوح فاتح نظيف',
    high_contrast: 'وضع التباين العالي',
    high_contrast_desc: 'يعزز الوضوح في بيئات المصانع ذات الإضاءة الساطعة أو المعاكسة.',
    ui_density: 'كثافة الواجهة',
    density_comfortable: 'مريح (قياسي للمس / المكتبي)',
    density_compact: 'مدمج (لقياسات عالية الكثافة)',
    accent_color: 'لون تمييز القياس عن بُعد',
    accent_blue: 'أزرق صناعي (Forge Blue)',
    accent_emerald: 'زمردي للأتمتة',
    accent_amber: 'كهرماني سيبراني',
    accent_violet: 'بنفسجي تقني',
    profile: 'ملف المستخدم',
    profile_info: 'الملف الشخصي وهوية المشغل',
    profile_subtitle: 'إدارة هويتك التشغيلية ومعلومات الاتصال ومحطة العمل الخاصة بك.',
    full_name: 'الاسم الكامل',
    department: 'القسم / الوحدة',
    job_title: 'المسمى الوظيفي',
    phone_number: 'رقم هاتف الاتصال',
    timezone: 'المنطقة الزمنية للمحطة',
    save_profile: 'حفظ تغييرات الملف الشخصي',
    profile_updated: 'تم تحديث تفضيلات الملف الشخصي بنجاح.',
    security: 'الأمان والوصول',
    security_title: 'الأمان والوصول والمصادقة',
    security_subtitle: 'إدارة بيانات الاعتماد والمصادقة الثنائية ومحطات العمل النشطة.',
    update_password: 'تحديث كلمة المرور',
    current_password: 'كلمة المرور الحالية',
    new_password: 'كلمة المرور الجديدة',
    confirm_password: 'تأكيد كلمة المرور الجديدة',
    password_updated: 'تم تحديث كلمة المرور بنجاح.',
    two_factor_auth: 'المصادقة الثنائية (2FA)',
    two_factor_desc: 'فرض مفتاح أمان مادي أو تطبيق TOTP للإجراءات الحساسة في المصنع.',
    two_factor_status_active: 'المصادقة الثنائية مفعلة ومحمية',
    two_factor_status_inactive: 'المصادقة الثنائية غير مفعلة',
    two_factor_setup_btn: 'تهيئة 2FA',
    two_factor_disable_btn: 'تعطيل المصادقة الثنائية',
    two_factor_modal_title: 'إعداد المصادقة الثنائية (TOTP)',
    two_factor_step_1: '١. امسح رمز الاستجابة السريعة في تطبيق المصادقة',
    two_factor_step_1_desc: 'امسح رمز الاستجابة السريعة هذا باستخدام Google Authenticator أو Microsoft Authenticator أو Apple Passwords.',
    two_factor_manual_key: 'المفتاح السري اليدوي',
    two_factor_copy_key: 'نسخ المفتاح',
    two_factor_copied: 'تم النسخ!',
    two_factor_step_2: '٢. حفظ رموز الاسترداد في حالات الطوارئ',
    two_factor_step_2_desc: 'احفظ رموز الاسترداد الـ 8 هذه في مكان آمن. يمكنك استخدامها لتسجيل الدخول إذا فقدت جهازك.',
    two_factor_step_3: '٣. تحقق من رمز TOTP المكون من 6 أرقام',
    two_factor_verify_btn: 'تحقق وتفعيل المصادقة الثنائية',
    two_factor_enabled_toast: 'تم تفعيل المصادقة الثنائية بنجاح!',
    two_factor_disabled_toast: 'تم تعطيل المصادقة الثنائية.',
    two_factor_login_title: 'المصادقة الثنائية (2FA)',
    two_factor_login_prompt: 'أدخل رمز التحقق المكون من 6 أرقام من تطبيق المصادقة أو رمز الاسترداد الاحتياطي.',
    two_factor_verify_login_btn: 'تحقق وتسجيل الدخول',
    active_sessions: 'محطات عمل المصنع النشطة',
    revoke_other_sessions: 'إنهاء الجلسات الأخرى',
    session_revoked: 'تم إنهاء جميع الجلسات الأخرى بنجاح.',
    notifications: 'الإشعارات والتنبيهات',
    notification_rules: 'قواعد التنبيهات والإشعارات',
    notification_rules_desc: 'تكوين مشغلات التنبيه وعتبات التصعيد وقنوات التسليم لأحداث صالة الإنتاج.',
    channel_in_app: 'تنبيهات داخل التطبيق',
    channel_email: 'ملخص البريد الإلكتروني',
    channel_audio: 'تنبيه صفارة إنذار صوتي',
    alert_low_stock: 'تنبيهات أمان انخفاض المخزون',
    alert_maintenance: 'تذكيرات صيانة الماكينات الدورية (٥٠٠ ساعة)',
    alert_shift_batch: 'ملخصات مخرجات إنتاج نوبة العمل',
    alert_db_sync: 'تحذيرات مزامنة قاعدة البيانات وزمن الوصول',
    save_notifications: 'حفظ قواعد الإشعارات',
    notifications_saved: 'تم تحديث قواعد الإشعارات بنجاح.',
    system: 'البنية التحتية للنظام',
    system_infra: 'البنية التحتية للنظام وقاعدة البيانات',
    system_infra_desc: 'إدارة اتصالات بوابة Go ومزامنة مجموعة MSSQL والنسخ الاحتياطي.',
    backend_api_url: 'عنوان URL لبوابة Go الخلفية',
    mssql_db_host: 'مضيف وكتالوج قاعدة بيانات MSSQL',
    auto_sync_interval: 'فاصل الاستقصاء للمزامنة التلقائية',
    default_export_format: 'تنسيق التصدير الافتراضي',
    telemetry_log_level: 'مستوى تسجيل القياس عن بُعد',
    trigger_backup: 'تشغيل النسخ الاحتياطي اليدوي لقاعدة البيانات',
    save_preferences: 'حفظ التكوين',
    system_config_saved: 'تم حفظ تكوين البنية التحتية للنظام بنجاح.',

    // Table headers & Details
    product_code: 'الرمز',
    category: 'الفئة',
    stock: 'المخزون',
    min: 'الحد الأدنى',
    shift: 'وردية العمل',
    operator: 'المشغل',
    machine_id: 'معرّف الماكينة',
    quantity: 'الكمية',
    status: 'الحالة',
    last_activity: 'آخر نشاط',
    actions: 'الإجراءات',
    role: 'الدور',
    user: 'المستخدم',
    last_login: 'آخر دخول',
    active_status_label: 'نشط',
    admin: 'مسؤول',
    supervisor: 'مشرف',
    operator_text: 'مشغل',

    // Units & Measures
    units: 'وحدات',
    pcs: 'قطعة',
    produce: 'إنتاج',
    view_all: 'عرض الكل',
    showing: 'عرض',
    of: 'من أصل',
    loading: 'جاري التحميل...',

    // Timeframes & Days
    tf_7d: '٧ أيام',
    tf_30d: '٣٠ يوماً',
    tf_ytd: 'منذ بداية العام',
    days_mon: 'الإثنين',
    days_tue: 'الثلاثاء',
    days_wed: 'الأربعاء',
    days_thu: 'الخميس',
    days_fri: 'الجمعة',
    days_sat: 'السبت',
    days_sun: 'الأحد',

    // Buttons
    save: 'حفظ المنتج',
    submit: 'إرسال',
    view: 'عرض',
    interface_language: 'لغة الواجهة',
  },
  es: {
    // Navigation & Sidebar
    dashboard: 'Panel Ejecutivo',
    products: 'Catálogo de Productos',
    production_logs: 'Registros de Producción',
    inventory: 'Inventario y Stock',
    reports: 'Reportes y Analítica',
    users: 'Acceso y Roles de Usuario',
    settings: 'Configuración del Sistema',
    help: 'Centro de Ayuda',
    logout: 'Cerrar Sesión',
    main_menu: 'Navegación Principal',
    enterprise_automation: 'Automatización Empresarial',

    // Dashboard Page
    executive_dashboard: 'Panel Ejecutivo',
    smart_control: 'Automatización Inteligente',
    realtime_overview: 'Supervisión en tiempo real de operaciones de manufactura e inventario.',
    refresh: 'Sincronizar Datos en Vivo',
    sync_data: 'Sincronizar Datos',

    // Header & Quick Actions
    search_placeholder: 'Buscar operaciones, productos, registros...',
    export: 'Exportar Datos',
    new_action: 'Acción Rápida',
    add_new_product: '+ Agregar Nuevo Producto',
    record_production: 'Registrar Producción',
    record_stock_out: 'Registrar Salida de Stock',

    // KPI Summary Cards
    total_products: 'Total de Productos',
    today_production: 'Producción de Hoy',
    current_inventory: 'Nivel Actual de Stock',
    low_stock_alerts: 'Alertas de Stock Bajo',
    production_efficiency: 'Eficiencia de Línea (OEE)',
    active_catalog: 'Ítems activos en catálogo',
    vs_daily_target: 'vs meta diaria',
    total_items_in_stock: 'Total de ítems en stock',
    require_attention: 'Ítems que requieren atención',
    optimal_output: 'Rendimiento óptimo de línea',

    // Dashboard widgets
    recent_activity: 'Flujo de Producción en Vivo',
    stock_status: 'Niveles de Stock y Seguridad',
    quick_stats: 'Resumen Operativo',
    view_all_logs: 'Ver Registros de Auditoría',
    manage_inventory: 'Abrir Gestión de Inventario',

    // Stock levels
    in_stock: 'En Stock',
    low_stock: 'Stock Bajo',
    out_of_stock: 'Crítico',
    units_left: 'unidades restantes',

    // Forms and Modals
    add_product_title: 'Crear Producto en Catálogo',
    edit_product_title: 'Modificar Producto de Catálogo',
    product_name: 'Nombre del Producto',
    unit: 'Unidad de Medida',
    min_stock: 'Umbral de Stock de Seguridad',
    current_stock: 'Cantidad Actual de Stock',
    save_product: 'Guardar Producto',
    saving: 'Procesando...',
    confirm_delete: '¿Está seguro de que desea eliminar este registro?',
    delete_warning: 'Esta acción no se puede deshacer y eliminará los registros de telemetría asociados.',

    // Common
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Volver al Panel',
    sign_in: 'Iniciar Sesión en Centro de Control',
    username: 'Usuario / ID de Operador',
    password: 'Contraseña',
    login: 'Autenticar Sesión',
    logging_in: 'Autenticando...',
    login_subtitle: 'Ingrese sus credenciales para acceder a los sistemas de control industrial.',

    // Settings Module Full Localization
    system_settings: 'Configuración del Sistema',
    system_config: 'Configuración de Control Industrial',
    settings_description: 'Administre preferencias de plataforma, seguridad, reglas de notificación y conectividad industrial.',
    search_settings: 'Buscar configuraciones...',
    language: 'Idioma',
    select_language: 'Idioma de la Interfaz',
    language_subtitle: 'Seleccione su idioma preferido para el panel de control industrial.',
    preview_format: 'Vista Previa de Formato en Vivo',
    appearance: 'Apariencia Visual',
    appearance_subtitle: 'Personalice el contraste del tema, densidad de interfaz y estilo de telemetría.',
    theme: 'Modo de Tema',
    theme_dark: 'Forge Oscuro (Recomendado para Salas de Control)',
    theme_light: 'Clean Slate Claro',
    high_contrast: 'Modo de Alto Contraste',
    high_contrast_desc: 'Mejora la visibilidad en entornos de fábrica con iluminación brillante o reflejos.',
    ui_density: 'Densidad de Interfaz',
    density_comfortable: 'Cómoda (Táctil / Escritorio Estándar)',
    density_compact: 'Compacta (Telemetría de Alta Densidad)',
    accent_color: 'Color de Acento de Telemetría',
    accent_blue: 'Forge Blue',
    accent_emerald: 'Emerald Automation',
    accent_amber: 'Cyber Amber',
    accent_violet: 'Tech Violet',
    profile: 'Perfil de Usuario',
    profile_info: 'Perfil e Identidad del Operador',
    profile_subtitle: 'Administre su identidad de operador, información de contacto y terminal de fábrica.',
    full_name: 'Nombre Completo',
    department: 'Departamento / Unidad',
    job_title: 'Cargo / Puesto',
    phone_number: 'Teléfono de Contacto',
    timezone: 'Zona Horaria de Terminal',
    save_profile: 'Guardar Cambios de Perfil',
    profile_updated: 'Preferencias de perfil actualizadas con éxito.',
    security: 'Seguridad y Acceso',
    security_title: 'Seguridad y Autenticación',
    security_subtitle: 'Administre credenciales de acceso, verificación en dos pasos y terminales activas.',
    update_password: 'Actualizar Contraseña',
    current_password: 'Contraseña Actual',
    new_password: 'Nueva Contraseña',
    confirm_password: 'Confirmar Nueva Contraseña',
    password_updated: 'Contraseña actualizada con éxito.',
    two_factor_auth: 'Autenticación de Dos Factores (2FA)',
    two_factor_desc: 'Exija llave de seguridad o aplicación TOTP para acciones críticas en planta.',
    two_factor_status_active: '2FA Activo y Protegido',
    two_factor_status_inactive: '2FA Inactivo',
    two_factor_setup_btn: 'Configurar 2FA',
    two_factor_disable_btn: 'Desactivar 2FA',
    two_factor_modal_title: 'Configuración de Autenticación de Dos Factores (TOTP)',
    two_factor_step_1: '1. Escanee el código QR en la aplicación de autenticación',
    two_factor_step_1_desc: 'Escanee este código QR con Google Authenticator, Microsoft Authenticator o Apple Passwords.',
    two_factor_manual_key: 'Clave Secreta Manual',
    two_factor_copy_key: 'Copiar Clave',
    two_factor_copied: '¡Copiado!',
    two_factor_step_2: '2. Guarde los Códigos de Recuperación de Emergencia',
    two_factor_step_2_desc: 'Guarde estos 8 códigos de recuperación de un solo uso en un lugar seguro para iniciar sesión si pierde su dispositivo.',
    two_factor_step_3: '3. Verifique el Código TOTP de 6 Dígitos',
    two_factor_verify_btn: 'Verificar y Activar 2FA',
    two_factor_enabled_toast: '¡La autenticación de dos factores ya está activa!',
    two_factor_disabled_toast: 'La autenticación de dos factores ha sido desactivada.',
    two_factor_login_title: 'Autenticación de Dos Factores (2FA)',
    two_factor_login_prompt: 'Ingrese el código de verificación de 6 dígitos de su aplicación de autenticación o un código de recuperación.',
    two_factor_verify_login_btn: 'Verificar e Iniciar Sesión',
    active_sessions: 'Sesiones Activas en Planta',
    revoke_other_sessions: 'Cerrar Otras Sesiones',
    session_revoked: 'Todas las demás sesiones activas han sido cerradas con éxito.',
    notifications: 'Notificaciones',
    notification_rules: 'Reglas de Alerta y Notificación',
    notification_rules_desc: 'Configure activadores de alerta, umbrales de escalación y canales de entrega.',
    channel_in_app: 'Alertas en la Aplicación',
    channel_email: 'Resumen por Correo',
    channel_audio: 'Alerta Sonora de Sirena',
    alert_low_stock: 'Alertas de Seguridad por Stock Bajo',
    alert_maintenance: 'Recordatorios de Mantenimiento de Máquinas (500h)',
    alert_shift_batch: 'Resúmenes de Producción por Turno',
    alert_db_sync: 'Advertencias de Sincronización y Latencia de BD',
    save_notifications: 'Guardar Reglas de Notificación',
    notifications_saved: 'Reglas de notificación guardadas con éxito.',
    system: 'Infraestructura del Sistema',
    system_infra: 'Infraestructura del Sistema y Base de Datos',
    system_infra_desc: 'Administre conexiones de gateway Go, sincronización de clúster MSSQL y respaldos.',
    backend_api_url: 'URL del Gateway API Go',
    mssql_db_host: 'Host y Catálogo de Base de Datos MSSQL',
    auto_sync_interval: 'Intervalo de Sondeo Automático',
    default_export_format: 'Formato Predeterminado de Exportación',
    telemetry_log_level: 'Nivel de Registro de Telemetría',
    trigger_backup: 'Ejecutar Respaldo Manual de Base de Datos',
    save_preferences: 'Guardar Configuración',
    system_config_saved: 'Configuración de infraestructura del sistema guardada con éxito.',

    // Table headers & Details
    product_code: 'Código',
    category: 'Categoría',
    stock: 'Stock',
    min: 'Mín',
    shift: 'Turno',
    operator: 'Operador',
    machine_id: 'ID de Máquina',
    quantity: 'Cantidad',
    status: 'Estado',
    last_activity: 'Última Actividad',
    actions: 'Acciones',
    role: 'Rol',
    user: 'Usuario',
    last_login: 'Último Acceso',
    active_status_label: 'Activo',
    admin: 'Admin',
    supervisor: 'Supervisor',
    operator_text: 'Operador',

    // Units & Measures
    units: 'unidades',
    pcs: 'pzas',
    produce: 'Producir',
    view_all: 'Ver Todo',
    showing: 'Mostrando',
    of: 'de',
    loading: 'Cargando...',

    // Timeframes & Days
    tf_7d: '7D',
    tf_30d: '30D',
    tf_ytd: 'YTD',
    days_mon: 'Lun',
    days_tue: 'Mar',
    days_wed: 'Mié',
    days_thu: 'Jue',
    days_fri: 'Vie',
    days_sat: 'Sáb',
    days_sun: 'Dom',

    // Buttons
    save: 'Guardar Producto',
    submit: 'Enviar',
    view: 'Ver',
    interface_language: 'Idioma de Interfaz',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const subscribeLang = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener('forge_lang_change', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('forge_lang_change', callback)
  }
}

const getLangSnapshot = (): Language => {
  try {
    const saved = localStorage.getItem('forge_lang') as Language
    if (saved && ['en', 'id', 'ar', 'es'].includes(saved)) return saved
  } catch {}
  return 'en'
}

const getServerLangSnapshot = (): Language => 'en'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLang,
    getLangSnapshot,
    getServerLangSnapshot
  )

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('forge_lang', lang)
      window.dispatchEvent(new Event('forge_lang_change'))
    } catch {}
  }

  const isRTL = language === 'ar'

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }

  const formatNumber = (value: number | string | null | undefined): string => {
    return formatNumberByLang(value, language)
  }

  const formatDate = (date?: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    return formatDateByLang(date, language, options)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber, formatDate, isRTL }}>
      <div
        dir="ltr"
        className={language === 'ar' ? 'font-arabic' : ''}
        style={{ minHeight: '100%' }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
