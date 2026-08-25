'use client'

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react'

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
    quick_actions: 'Quick Operations',
    quick_actions_subtitle: 'Direct manufacturing inputs & inventory transactions',
    system_status: 'Infrastructure Status',
    system_status_subtitle: 'Live database and backend API health monitoring',
    all_systems_nominal: 'All Systems Nominal',
    last_sync_text: 'Last sync: 2 mins ago (Port 6060/6063)',
    online: 'Online',
    synced: 'Synced',
    action_required: 'Action Required',
    low_stock_subtitle: 'Products falling below minimum safety threshold',
    live_output: 'Live Output',
    production_analytics: 'Production Analytics',
    production_analytics_subtitle: 'Real-time daily manufacturing output & yield efficiency trend',

    // Products Module
    products_management: 'Product Catalog & Specifications',
    master_catalog: 'Master Catalog',
    products_subtitle: 'Manage manufacturing specifications, bill of materials, and safety thresholds.',
    search_products: 'Search products by name or ID...',
    add_product: 'Add Product',
    product_name: 'Product Name',
    category: 'Category',
    unit_of_measure: 'Unit of Measure',
    initial_stock: 'Initial Stock',
    min_stock_level: 'Min. Stock Level',
    primary_supplier: 'Primary Supplier',
    description: 'Description',
    active_status: 'Active Status',
    all_categories: 'All Categories',
    all_statuses: 'All Statuses',
    in_stock_status: 'In Stock',
    low_stock_status: 'Low Stock',
    out_of_stock_status: 'Out of Stock',
    product_id: 'Product ID',
    unit: 'Unit',
    current_stock: 'Current Stock',
    min_stock: 'Min Stock',

    // Production Logs Module
    production_logs_title: 'Manufacturing Production Logs',
    live_manufacturing_data: 'Live Factory Output',
    production_logs_subtitle: 'Record shift output, track machine operations, and monitor batch quantities.',
    new_log_entry: 'New Production Log Entry',
    recent_logs: 'Recent Production History',
    select_product: 'Target Product',
    select_machine: 'Assigned Machine',
    quantity_produced: 'Produced Quantity',
    shift: 'Work Shift',
    operator_name: 'Operator In Charge',
    submit_log: 'Submit Production Log',
    log_id: 'Log ID',
    timestamp: 'Timestamp',
    filter_by_machine: 'All Machines',

    // Inventory Module
    inventory_title: 'Inventory & Warehouse Operations',
    stock_operations: 'Stock Operations',
    inventory_subtitle: 'Audit movements, monitor storage capacity, and track material valuations.',
    inventory_management: 'Inventory Management',
    stock_movements: 'Stock Movements Audit',
    stock_movements_subtitle: 'Comprehensive audit trail of incoming (IN) and outgoing (OUT) inventory mutations.',
    total_warehouse_value: 'Total Warehouse Valuation',
    storage_capacity: 'Warehouse Storage Capacity',
    last_audit: 'Last Inventory Audit',
    zone_utilization: 'Storage Zone Utilization',
    all_movements: 'All Movements',
    incoming_in: 'Stock In (Production)',
    outgoing_out: 'Stock Out (Dispatch)',
    movement_id: 'Movement ID',
    mutation_type: 'Mutation Type',
    mutation_date: 'Date & Time',
    export_report: 'Export Report',
    stock_out_btn: 'Dispatch Stock (Out)',

    // Reports Module
    reports_title: 'Operational Analytics & Reports',
    intelligence_center: 'Intelligence Hub',
    reports_subtitle: 'In-depth yield metrics, machine performance breakdown, and inventory forecasts.',
    reports_analytics: 'Reports & Analytics',
    monthly_yield: 'Monthly Production Yield Trend',
    top_products_distribution: 'Top Products Volume Share',
    machine_performance_heatmap: 'Machine Operational Heatmap',
    inventory_forecast: '30-Day Inventory Stock Forecast',

    // Users Module
    users_title: 'User Access & Role Management',
    access_control: 'Access Control & Security',
    users_subtitle: 'Manage user credentials, assign role tiers, and configure platform authorizations.',
    user_management: 'User Management',
    registered_users: 'Registered Platform Users',
    invite_user: 'Create User Account',
    role_permissions: 'Role Permissions Matrix',
    all_roles: 'All Roles',
    admin_role: 'Administrator',
    supervisor_role: 'Supervisor',
    operator_role: 'Operator',
    admin_role_desc: 'Full system privileges. Manages configurations, billing, audits, and user accounts.',
    supervisor_role_desc: 'Supervises production lines, generates analytics reports, and approves schedules.',
    operator_role_desc: 'Executes work orders, logs daily machine batches, and views line output.',
    manage_roles: 'Manage platform access, roles, and security permissions.',

    // Settings Module
    system_settings: 'System Settings & Preferences',
    settings_description: 'Manage account configuration, language localization, and system preferences.',
    search_settings: 'Search settings...',
    select_language: 'Select Interface Language',
    language: 'Language',
    language_subtitle: 'Choose your preferred control center language.',
    appearance: 'Appearance',
    appearance_subtitle: 'Customize the look and feel of the interface.',
    theme: 'Theme',
    theme_dark: 'Dark',
    theme_light: 'Light',
    high_contrast: 'High Contrast Mode',
    high_contrast_desc: 'Increase contrast for better readability in harsh lighting.',
    profile: 'Profile',
    security: 'Security',
    notifications: 'Notifications',
    system: 'System',
    configuration: 'Configuration',
    config_active: 'Configuration options for',
    config_active_suffix: 'are active.',
    system_roles: 'System Roles',
    manage_user_access: 'Manage user access and permissions.',
    add_user: 'Add User',
    save_preferences: 'Save Preferences',

    // Table Headers & Labels
    time: 'Time',
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
    cancel: 'Cancel',
    submit: 'Submit',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
  },

  id: {
    // Navigation & Sidebar
    dashboard: 'Dashboard',
    products: 'Master Produk',
    production_logs: 'Log Produksi',
    inventory: 'Manajemen Stok',
    reports: 'Laporan & Analitik',
    users: 'Manajemen Pengguna',
    settings: 'Pengaturan Sistem',
    help: 'Pusat Bantuan',
    logout: 'Keluar Akun',
    main_menu: 'Menu Utama',
    enterprise_automation: 'Otomasi Industri Terpadu',

    // Dashboard Page
    executive_dashboard: 'Dashboard Eksekutif',
    smart_control: 'Otomasi Cerdas',
    realtime_overview: 'Gambaran terpadu operasional manufaktur & pemantauan inventaris real-time.',
    refresh: 'Sinkronisasi Data',
    sync_data: 'Sinkron Data',

    // Header & Quick Actions
    search_placeholder: 'Cari operasional, produk, riwayat log...',
    export: 'Ekspor Data',
    new_action: 'Aksi Cepat',
    add_new_product: '+ Tambah Produk Baru',
    record_production: 'Catat Produksi Harian',
    record_stock_out: 'Catat Pengeluaran Stok',

    // KPI Summary Cards
    total_products: 'Total Produk Aktif',
    today_production: 'Volume Produksi Hari Ini',
    current_inventory: 'Total Stok Tersedia',
    low_stock_alerts: 'Peringatan Stok Rendah',
    production_efficiency: 'Efisiensi Produksi (OEE)',
    active_catalog: 'Item katalog aktif',
    vs_daily_target: 'vs target harian',
    total_items_in_stock: 'Total barang tersedia',
    require_attention: 'Item butuh perhatian',
    optimal_output: 'Output lini optimal',

    // Dashboard widgets
    quick_actions: 'Aksi Operasional Cepat',
    quick_actions_subtitle: 'Akses cepat input manufaktur & mutasi inventaris',
    system_status: 'Status Infrastruktur Sistem',
    system_status_subtitle: 'Pemantauan langsung kesehatan database & layanan backend API',
    all_systems_nominal: 'Semua Sistem Normal',
    last_sync_text: 'Sinkronisasi: 2 mnt lalu (Port 6060/6063)',
    online: 'Online',
    synced: 'Tersinkron',
    action_required: 'Tindakan Diperlukan',
    low_stock_subtitle: 'Produk yang berada di bawah ambang batas stok minimum aman',
    live_output: 'Output Real-Time',
    production_analytics: 'Analitik Produksi',
    production_analytics_subtitle: 'Tren harian hasil manufaktur & efisiensi produksi real-time',

    // Products Module
    products_management: 'Katalog Master & Spesifikasi Produk',
    master_catalog: 'Katalog Master',
    products_subtitle: 'Kelola spesifikasi teknis komponen manufaktur, bill of materials, dan batas stok.',
    search_products: 'Cari produk berdasarkan nama atau ID...',
    add_product: 'Tambah Produk',
    product_name: 'Nama Produk / Komponen',
    category: 'Kategori',
    unit_of_measure: 'Satuan Ukuran',
    initial_stock: 'Stok Awal',
    min_stock_level: 'Batas Stok Minimum',
    primary_supplier: 'Pemasok Utama',
    description: 'Deskripsi Spesifikasi',
    active_status: 'Status Aktif',
    all_categories: 'Semua Kategori',
    all_statuses: 'Semua Status',
    in_stock_status: 'Stok Aman',
    low_stock_status: 'Stok Kritis',
    out_of_stock_status: 'Stok Habis',
    product_id: 'ID Produk',
    unit: 'Satuan',
    current_stock: 'Stok Saat Ini',
    min_stock: 'Batas Min.',

    // Production Logs Module
    production_logs_title: 'Log & Riwayat Produksi Manufaktur',
    live_manufacturing_data: 'Data Output Pabrik Real-Time',
    production_logs_subtitle: 'Pencatatan output per shift kerja, pengawasan mesin, dan kuantitas batch.',
    new_log_entry: 'Input Catatan Produksi Baru',
    recent_logs: 'Riwayat Catatan Produksi Terkini',
    select_product: 'Pilih Produk Target',
    select_machine: 'Pilih Mesin Produksi',
    quantity_produced: 'Jumlah Output Dihasilkan',
    shift: 'Shift Kerja',
    operator_name: 'Nama Operator Bertugas',
    submit_log: 'Simpan Catatan Produksi',
    log_id: 'ID Log',
    timestamp: 'Waktu Input',
    filter_by_machine: 'Semua Mesin Produksi',

    // Inventory Module
    inventory_title: 'Manajemen Inventaris & Operasional Gudang',
    stock_operations: 'Operasional Gudang',
    inventory_subtitle: 'Audit pergerakan stok, pemantauan kapasitas penyimpanan, dan valuasi aset material.',
    inventory_management: 'Manajemen Stok',
    stock_movements: 'Audit Riwayat Mutasi Stok',
    stock_movements_subtitle: 'Jejak audit komprehensif mutasi barang masuk (IN) dan barang keluar (OUT).',
    total_warehouse_value: 'Total Valuasi Material Gudang',
    storage_capacity: 'Kapasitas Penyimpanan Terpakai',
    last_audit: 'Audit Terakhir Gudang',
    zone_utilization: 'Utilisasi Zona Penyimpanan',
    all_movements: 'Semua Jenis Mutasi',
    incoming_in: 'Barang Masuk (Produksi)',
    outgoing_out: 'Barang Keluar (Distribusi)',
    movement_id: 'ID Mutasi',
    mutation_type: 'Jenis Mutasi',
    mutation_date: 'Waktu Transaksi',
    export_report: 'Ekspor Laporan Mutasi',
    stock_out_btn: 'Keluarkan Stok (Dispatch)',

    // Reports Module
    reports_title: 'Laporan & Analisis Kinerja Manufaktur',
    intelligence_center: 'Pusat Analisis & Intelijen',
    reports_subtitle: 'Laporan mendalam hasil produksi, efisiensi mesin, dan proyeksi stok barang.',
    reports_analytics: 'Laporan & Analitik',
    monthly_yield: 'Tren Hasil Produksi Bulanan',
    top_products_distribution: 'Distribusi Volume Produk Teratas',
    machine_performance_heatmap: 'Heatmap Efisiensi Mesin Pabrik',
    inventory_forecast: 'Proyeksi Stok Inventaris 30 Hari',

    // Users Module
    users_title: 'Manajemen Pengguna & Hak Akses',
    access_control: 'Kontrol Hak Akses & Keamanan',
    users_subtitle: 'Pengelolaan akun personil, penetapan peran hierarkis, dan konfigurasi izin sistem.',
    user_management: 'Manajemen Pengguna',
    registered_users: 'Daftar Pengguna Terdaftar',
    invite_user: 'Tambah Akun Pengguna',
    role_permissions: 'Matriks Hak Akses Peran',
    all_roles: 'Semua Peran',
    admin_role: 'Administrator',
    supervisor_role: 'Supervisor Lini',
    operator_role: 'Operator Mesin',
    admin_role_desc: 'Akses penuh ke semua modul sistem, pengaturan global, penagihan, dan akun pengguna.',
    supervisor_role_desc: 'Mengawasi jadwal produksi, mengekspor laporan kinerja, dan menyetujui mutasi stok.',
    operator_role_desc: 'Akses pencatatan log hasil mesin, input shift harian, dan melihat kuota produksi.',
    manage_roles: 'Kelola hak akses, peran, dan izin keamanan platform.',

    // Settings Module
    system_settings: 'Pengaturan Sistem & Preferensi',
    settings_description: 'Kelola preferensi akun, pelokalan bahasa, dan konfigurasi sistem.',
    search_settings: 'Cari pengaturan sistem...',
    select_language: 'Pilih Bahasa Antarmuka',
    language: 'Bahasa Antarmuka',
    language_subtitle: 'Pilih bahasa operasional untuk panel kontrol pabrik.',
    appearance: 'Tampilan & Tema',
    appearance_subtitle: 'Kustomisasi tema warna dan kenyamanan visual.',
    theme: 'Tema Antarmuka',
    theme_dark: 'Mode Gelap (Dark)',
    theme_light: 'Mode Terang (Light)',
    high_contrast: 'Mode Kontras Tinggi',
    high_contrast_desc: 'Tingkatkan keterbacaan di area pabrik dengan pencahayaan tinggi.',
    profile: 'Profil Pengguna',
    security: 'Keamanan & Sandi',
    notifications: 'Pengaturan Notifikasi',
    system: 'Konfigurasi Sistem',
    configuration: 'Konfigurasi',
    config_active: 'Opsi konfigurasi untuk',
    config_active_suffix: 'sudah aktif.',
    system_roles: 'Peran Sistem',
    manage_user_access: 'Kelola akses dan izin pengguna platform.',
    add_user: 'Tambah Pengguna',
    save_preferences: 'Simpan Preferensi',

    // Table Headers & Labels
    time: 'Waktu',
    operator: 'Operator',
    machine_id: 'ID Mesin',
    quantity: 'Jumlah',
    status: 'Status',
    last_activity: 'Aktivitas Terakhir',
    actions: 'Tindakan',
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
    cancel: 'Batal',
    submit: 'Kirim Log',
    view: 'Lihat Detail',
    edit: 'Ubah Data',
    delete: 'Hapus',
  },

  ar: {
    // Navigation & Sidebar
    dashboard: 'لوحة التحكم',
    products: 'كتالوج المنتجات',
    production_logs: 'سجلات الإنتاج',
    inventory: 'إدارة المخزون',
    reports: 'التقارير والتحليلات',
    users: 'إدارة المستخدمين',
    settings: 'إعدادات النظام',
    help: 'مركز المساعدة',
    logout: 'تسجيل الخروج',
    main_menu: 'القائمة الرئيسية',
    enterprise_automation: 'أتمتة المؤسسات الذكية',

    // Dashboard Page
    executive_dashboard: 'لوحة التحكم التنفيذية',
    smart_control: 'الأتمتة الذكية',
    realtime_overview: 'نظرة عامة فورية على عمليات التصنيع وإدارة المخزون العالمية.',
    refresh: 'تزامن البيانات',
    sync_data: 'مزامنة',

    // Header & Quick Actions
    search_placeholder: 'ابحث في العمليات، المنتجات، السجلات...',
    export: 'تصدير البيانات',
    new_action: 'إجراء سريع',
    add_new_product: '+ إضافة منتج جديد',
    record_production: 'تسجيل إنتاج يومي',
    record_stock_out: 'تسجيل صرف مخزون',

    // KPI Summary Cards
    total_products: 'إجمالي المنتجات النشطة',
    today_production: 'إنتاج اليوم',
    current_inventory: 'المخزون الحالي المتوفر',
    low_stock_alerts: 'تنبيهات انخفاض المخزون',
    production_efficiency: 'كفاءة الخط (OEE)',
    active_catalog: 'عناصر الكتالوج النشطة',
    vs_daily_target: 'مقارنة بالهدف اليومي',
    total_items_in_stock: 'إجمالي العناصر المتوفرة',
    require_attention: 'عناصر تحتاج اهتماماً',
    optimal_output: 'مخرجات الخط الأمثل',

    // Dashboard widgets
    quick_actions: 'العمليات السريعة',
    quick_actions_subtitle: 'إدخالات التصنيع المباشرة وحركات المخزون',
    system_status: 'حالة البنية التحتية',
    system_status_subtitle: 'مراقبة حية لصحة قاعدة البيانات وواجهة API',
    all_systems_nominal: 'جميع الأنظمة تعمل بشكل طبيعي',
    last_sync_text: 'آخر مزامنة: منذ دقيقتين (المنفذ ٦٠٦٠ / ٦٠٦٣)',
    online: 'متصل',
    synced: 'متزامن',
    action_required: 'مطلوب إجراء',
    low_stock_subtitle: 'المنتجات الأقل من الحد الأدنى الآمن للمخزون',
    live_output: 'الإنتاج المباشر',
    production_analytics: 'تحليلات الإنتاج',
    production_analytics_subtitle: 'اتجاه مخرجات التصنيع اليومية وكفاءة الإنتاج في الوقت الفعلي',

    // Products Module
    products_management: 'كتالوج المنتجات والمواصفات',
    master_catalog: 'الكتالوج الرئيسي',
    products_subtitle: 'إدارة مواصفات التصنيع، وقائمة المواد، وحدود الأمان.',
    search_products: 'ابحث عن منتج بالاسم أو الرمز...',
    add_product: 'إضافة منتج',
    product_name: 'اسم المنتج',
    category: 'الفئة',
    unit_of_measure: 'وحدة القياس',
    initial_stock: 'المخزون الأولي',
    min_stock_level: 'الحد الأدنى للمخزون',
    primary_supplier: 'المورد الرئيسي',
    description: 'الوصف',
    active_status: 'الحالة',
    all_categories: 'جميع الفئات',
    all_statuses: 'جميع الحالات',
    in_stock_status: 'متوفر',
    low_stock_status: 'مخزون منخفض',
    out_of_stock_status: 'نفد المخزون',
    product_id: 'رمز المنتج',
    unit: 'الوحدة',
    current_stock: 'المخزون الحالي',
    min_stock: 'الحد الأدنى',

    // Production Logs Module
    production_logs_title: 'سجلات الإنتاج والتصنيع',
    live_manufacturing_data: 'بيانات المصنع المباشرة',
    production_logs_subtitle: 'تسجيل مخرجات الوردية ومراقبة عمليات الآلات وكميات الدُفعات.',
    new_log_entry: 'إدخال سجل إنتاج جديد',
    recent_logs: 'سجل الإنتاج الأخير',
    select_product: 'المنتج المستهدف',
    select_machine: 'الآلة المحددة',
    quantity_produced: 'الكمية المنتجة',
    shift: 'وردية العمل',
    operator_name: 'المشغل المسؤول',
    submit_log: 'حفظ سجل الإنتاج',
    log_id: 'رمز السجل',
    timestamp: 'وقت التسجيل',
    filter_by_machine: 'جميع الآلات',

    // Inventory Module
    inventory_title: 'إدارة المخزون وعمليات المستودعات',
    stock_operations: 'عمليات المخزون',
    inventory_subtitle: 'تدقيق الحركات، مراقبة سعة التخزين، وتتبع تقييمات المواد.',
    inventory_management: 'إدارة المخزون',
    stock_movements: 'تدقيق حركات المخزون',
    stock_movements_subtitle: 'مسار تدقيق شامل لحركات الوارد والصادر للمخزون.',
    total_warehouse_value: 'إجمالي تقييم المستودع',
    storage_capacity: 'سعة تخزين المستودع',
    last_audit: 'آخر مراجعة للمخزون',
    zone_utilization: 'استخدام منطقة التخزين',
    all_movements: 'جميع الحركات',
    incoming_in: 'وارد (إنتاج)',
    outgoing_out: 'صادر (شحن)',
    movement_id: 'رمز الحركة',
    mutation_type: 'نوع الحركة',
    mutation_date: 'التاريخ والوقت',
    export_report: 'تصدير التقرير',
    stock_out_btn: 'صرف مخزون (صادر)',

    // Reports Module
    reports_title: 'التحليلات والتقارير التشغيلية',
    intelligence_center: 'مركز التحليلات والذكاء',
    reports_subtitle: 'مقاييس الإنتاجية المتعمقة، وأداء الآلات، وتوقعات المخزون.',
    reports_analytics: 'التقارير والتحليلات',
    monthly_yield: 'اتجاه إنتاجية التصنيع الشهرية',
    top_products_distribution: 'توزيع حجم المنتجات الأعلى',
    machine_performance_heatmap: 'الخريطة الحرارية لأداء الآلات',
    inventory_forecast: 'توقعات المخزون لـ ٣٠ يوماً',

    // Users Module
    users_title: 'إدارة المستخدمين وصلاحيات الوصول',
    access_control: 'التحكم في الوصول والأمان',
    users_subtitle: 'إدارة حسابات المستخدمين، وتعيين الأدوار، وتكوين الأذونات.',
    user_management: 'إدارة المستخدمين',
    registered_users: 'المستخدمون المسجلون',
    invite_user: 'إنشاء حساب مستخدم',
    role_permissions: 'مصفوفة أذونات الأدوار',
    all_roles: 'جميع الأدوار',
    admin_role: 'مدير النظام',
    supervisor_role: 'مشرف الإنتاج',
    operator_role: 'مشغل الآلات',
    admin_role_desc: 'صلاحيات كاملة في النظام. إدارة الإعدادات والفواتير والتدقيق والمستخدمين.',
    supervisor_role_desc: 'الإشراف على خطوط الإنتاج وإنشاء تقارير التحليلات وجداول العمل.',
    operator_role_desc: 'تنفيذ أوامر العمل وتسجيل دفعات الآلات اليومية ومتابعة المخرجات.',
    manage_roles: 'إدارة الصلاحيات والأدوار وإعدادات الأمان.',

    // Settings Module
    system_settings: 'إعدادات النظام والتفضيلات',
    settings_description: 'إدارة إعدادات الحساب ولغة الواجهة وتفضيلات النظام.',
    search_settings: 'بحث في الإعدادات...',
    select_language: 'اختر لغة الواجهة',
    language: 'اللغة',
    language_subtitle: 'اختر اللغة المفضلة لمركز التحكم.',
    appearance: 'المظهر',
    appearance_subtitle: 'تخصيص مظهر وإحساس الواجهة.',
    theme: 'المظهر',
    theme_dark: 'داكن',
    theme_light: 'فاتح',
    high_contrast: 'وضع التباين العالي',
    high_contrast_desc: 'تحسين التباين لقراءة أفضل في بيئة المصنع.',
    profile: 'الملف الشخصي',
    security: 'الأمان',
    notifications: 'الإشعارات',
    system: 'النظام',
    configuration: 'الإعداد',
    config_active: 'خيارات الإعداد لـ',
    config_active_suffix: 'نشطة.',
    system_roles: 'أدوار النظام',
    manage_user_access: 'إدارة وصول المستخدمين والصلاحيات.',
    add_user: 'إضافة مستخدم',
    save_preferences: 'حفظ التفضيلات',

    // Table Headers & Labels
    time: 'الوقت',
    operator: 'المشغل',
    machine_id: 'رقم الآلة',
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
    units: 'وحدة',
    pcs: 'قطعة',
    produce: 'إنتاج',
    view_all: 'عرض الكل',
    showing: 'عرض',
    of: 'من',
    loading: 'جار التحميل...',

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
    cancel: 'إلغاء',
    submit: 'إرسال',
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف',
  },

  es: {
    // Navigation & Sidebar
    dashboard: 'Panel de Control',
    products: 'Catálogo de Productos',
    production_logs: 'Registros de Producción',
    inventory: 'Gestión de Inventario',
    reports: 'Informes y Análisis',
    users: 'Gestión de Usuarios',
    settings: 'Configuración del Sistema',
    help: 'Centro de Ayuda',
    logout: 'Cerrar Sesión',
    main_menu: 'Menú Principal',
    enterprise_automation: 'Automatización Empresarial',

    // Dashboard Page
    executive_dashboard: 'Panel Ejecutivo',
    smart_control: 'Automatización Inteligente',
    realtime_overview: 'Resumen en tiempo real de operaciones de fabricación e inventario global.',
    refresh: 'Sincronizar Datos',
    sync_data: 'Sincronizar',

    // Header & Quick Actions
    search_placeholder: 'Buscar operaciones, productos, registros...',
    export: 'Exportar Datos',
    new_action: 'Acción Rápida',
    add_new_product: '+ Añadir Producto',
    record_production: 'Registrar Producción',
    record_stock_out: 'Registrar Salida de Stock',

    // KPI Summary Cards
    total_products: 'Total de Productos Activos',
    today_production: 'Producción de Hoy',
    current_inventory: 'Nivel de Stock Actual',
    low_stock_alerts: 'Alertas de Stock Bajo',
    production_efficiency: 'Eficiencia de Línea (OEE)',
    active_catalog: 'Artículos activos en catálogo',
    vs_daily_target: 'vs objetivo diario',
    total_items_in_stock: 'Total de artículos en stock',
    require_attention: 'Artículos requieren atención',
    optimal_output: 'Rendimiento óptimo de línea',

    // Dashboard widgets
    quick_actions: 'Operaciones Rápidas',
    quick_actions_subtitle: 'Entradas directas de fabricación y transacciones de inventario',
    system_status: 'Estado de la Infraestructura',
    system_status_subtitle: 'Monitoreo en vivo de la base de datos y la API backend',
    all_systems_nominal: 'Todos los Sistemas Nominales',
    last_sync_text: 'Última sinc.: hace 2 min (Puerto 6060/6063)',
    online: 'En Línea',
    synced: 'Sincronizado',
    action_required: 'Acción Requerida',
    low_stock_subtitle: 'Productos por debajo del umbral mínimo de seguridad',
    live_output: 'Producción en Vivo',
    production_analytics: 'Análisis de Producción',
    production_analytics_subtitle: 'Tendencia diaria de producción y eficiencia en tiempo real',

    // Products Module
    products_management: 'Catálogo de Productos y Especificaciones',
    master_catalog: 'Catálogo Maestro',
    products_subtitle: 'Gestionar especificaciones de fabricación, lista de materiales y umbrales de seguridad.',
    search_products: 'Buscar productos por nombre o ID...',
    add_product: 'Añadir Producto',
    product_name: 'Nombre del Producto',
    category: 'Categoría',
    unit_of_measure: 'Unidad de Medida',
    initial_stock: 'Stock Inicial',
    min_stock_level: 'Nivel Mínimo de Stock',
    primary_supplier: 'Proveedor Principal',
    description: 'Descripción',
    active_status: 'Estado Activo',
    all_categories: 'Todas las Categorías',
    all_statuses: 'Todos los Estados',
    in_stock_status: 'En Stock',
    low_stock_status: 'Stock Bajo',
    out_of_stock_status: 'Agotado',
    product_id: 'ID de Producto',
    unit: 'Unidad',
    current_stock: 'Stock Actual',
    min_stock: 'Stock Mínimo',

    // Production Logs Module
    production_logs_title: 'Registros de Producción y Fabricación',
    live_manufacturing_data: 'Datos de Planta en Vivo',
    production_logs_subtitle: 'Registrar producción por turno, monitorear máquinas y lotes.',
    new_log_entry: 'Nueva Entrada de Producción',
    recent_logs: 'Historial de Producción Reciente',
    select_product: 'Producto Destino',
    select_machine: 'Máquina Asignada',
    quantity_produced: 'Cantidad Producida',
    shift: 'Turno de Trabajo',
    operator_name: 'Operador a Cargo',
    submit_log: 'Guardar Registro de Producción',
    log_id: 'ID de Registro',
    timestamp: 'Fecha y Hora',
    filter_by_machine: 'Todas las Máquinas',

    // Inventory Module
    inventory_title: 'Gestión de Inventario y Operaciones de Almacén',
    stock_operations: 'Operaciones de Stock',
    inventory_subtitle: 'Auditar movimientos, monitorear capacidad y valorar materiales en tiempo real.',
    inventory_management: 'Gestión de Inventario',
    stock_movements: 'Auditoría de Movimientos de Stock',
    stock_movements_subtitle: 'Historial completo de movimientos de entrada (IN) y salida (OUT) de almacén.',
    total_warehouse_value: 'Valor Total del Almacén',
    storage_capacity: 'Capacidad de Almacenamiento',
    last_audit: 'Última Auditoría de Stock',
    zone_utilization: 'Utilización de Zona',
    all_movements: 'Todos los Movimientos',
    incoming_in: 'Entrada (Producción)',
    outgoing_out: 'Salida (Despacho)',
    movement_id: 'ID de Movimiento',
    mutation_type: 'Tipo de Movimiento',
    mutation_date: 'Fecha y Hora',
    export_report: 'Exportar Informe',
    stock_out_btn: 'Despachar Stock (Salida)',

    // Reports Module
    reports_title: 'Informes y Análisis Operativos',
    intelligence_center: 'Centro de Inteligencia',
    reports_subtitle: 'Métricas de rendimiento, desglose de máquinas y pronósticos de inventario.',
    reports_analytics: 'Informes y Analítica',
    monthly_yield: 'Tendencia de Rendimiento Mensual',
    top_products_distribution: 'Distribución de Volumen de Productos',
    machine_performance_heatmap: 'Mapa de Calor de Rendimiento de Máquinas',
    inventory_forecast: 'Pronóstico de Stock a 30 Días',

    // Users Module
    users_title: 'Gestión de Usuarios y Control de Accesos',
    access_control: 'Control de Acceso y Seguridad',
    users_subtitle: 'Gestionar credenciales, asignar niveles de rol y configurar autorizaciones.',
    user_management: 'Gestión de Usuarios',
    registered_users: 'Usuarios Registrados en la Plataforma',
    invite_user: 'Crear Cuenta de Usuario',
    role_permissions: 'Matriz de Permisos por Rol',
    all_roles: 'Todos los Roles',
    admin_role: 'Administrador',
    supervisor_role: 'Supervisor',
    operator_role: 'Operador',
    admin_role_desc: 'Acceso total al sistema. Configuración global, auditorías y gestión de cuentas.',
    supervisor_role_desc: 'Supervisa líneas de producción, genera informes y gestiona horarios.',
    operator_role_desc: 'Ejecuta órdenes de trabajo, registra lotes y consulta métricas.',
    manage_roles: 'Gestionar accesos, roles y permisos de seguridad.',

    // Settings Module
    system_settings: 'Configuración del Sistema y Preferencias',
    settings_description: 'Administra la configuración de tu cuenta, idioma y preferencias del sistema.',
    search_settings: 'Buscar configuraciones...',
    select_language: 'Seleccionar Idioma de Interfaz',
    language: 'Idioma de Interfaz',
    language_subtitle: 'Elige tu idioma preferido para el centro de control.',
    appearance: 'Apariencia Visual',
    appearance_subtitle: 'Personaliza el aspecto y la sensación de la interfaz.',
    theme: 'Tema de Interfaz',
    theme_dark: 'Modo Oscuro (Dark)',
    theme_light: 'Modo Claro (Light)',
    high_contrast: 'Modo de Alto Contraste',
    high_contrast_desc: 'Aumenta el contraste para mejor legibilidad en entornos industriales.',
    profile: 'Perfil de Usuario',
    security: 'Seguridad y Contraseña',
    notifications: 'Notificaciones del Sistema',
    system: 'Configuración del Sistema',
    configuration: 'Configuración',
    config_active: 'Opciones de configuración para',
    config_active_suffix: 'están activas.',
    system_roles: 'Roles del Sistema',
    manage_user_access: 'Gestionar acceso y permisos de usuarios.',
    add_user: 'Añadir Usuario',
    save_preferences: 'Guardar Preferencias',

    // Table Headers & Labels
    time: 'Hora',
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
    cancel: 'Cancelar',
    submit: 'Enviar',
    view: 'Ver',
    edit: 'Editar',
    delete: 'Eliminar',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const emptySubscribe = () => () => {}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const [language, setLanguageState] = useState<Language>('en')

  // Initialize from storage once mounted
  const storedLang = useSyncExternalStore(
    emptySubscribe,
    () => {
      const saved = localStorage.getItem('forge_lang') as Language
      return saved && ['en', 'id', 'ar', 'es'].includes(saved) ? saved : null
    },
    () => null
  )

  const currentLanguage = storedLang || language

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_lang', lang)
    }
  }

  const isRTL = currentLanguage === 'ar'

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key
  }

  const formatNumber = (value: number | string | null | undefined): string => {
    return formatNumberByLang(value, currentLanguage)
  }

  const formatDate = (date?: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    return formatDateByLang(date, currentLanguage, options)
  }

  return (
    <LanguageContext.Provider value={{ language: currentLanguage, setLanguage, t, formatNumber, formatDate, isRTL }}>
      <div
        dir="ltr"
        className={currentLanguage === 'ar' ? 'font-arabic' : ''}
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
