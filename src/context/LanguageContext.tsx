'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'id' | 'ar' | 'es'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Sidebar
    dashboard: 'Dashboard',
    products: 'Products',
    production_logs: 'Production Logs',
    inventory: 'Inventory',
    reports: 'Reports',
    users: 'Users',
    settings: 'Settings',
    help: 'Help',
    logout: 'Logout',
    main_menu: 'Main Menu',

    // Dashboard page
    executive_dashboard: 'Executive Dashboard',
    smart_control: 'Smart Control',
    realtime_overview: 'Real-time overview of global manufacturing operations & inventory.',
    refresh: 'Sync Live Data',

    // Header
    search_placeholder: 'Search operations, products, logs...',
    export: 'Export',
    new_action: 'New Action',
    add_new_product: '+ Add New Product',
    record_production: '📝 Record Production',
    record_stock_out: '📦 Record Stock Out',

    // KPI Summary Cards
    total_products: 'Total Products',
    today_production: "Today's Production",
    current_inventory: 'Current Inventory',
    low_stock_alerts: 'Low Stock Alerts',
    production_efficiency: 'Production Efficiency',
    active_catalog: 'Active catalog items',
    vs_daily_target: 'vs daily target',
    total_items_in_stock: 'Total items in stock',
    require_attention: 'Items require attention',
    optimal_output: 'Optimal line output',

    // Charts
    production_analytics: 'Production Analytics',
    machine_performance: 'Machine Performance',
    inventory_forecast: 'Inventory Forecast',
    monthly_production_yield: 'Monthly Production Yield',
    top_products: 'Top Products',

    // Products module
    product_catalog: 'Product Catalog',
    search_products: 'Search products...',
    add_product: 'Add Product',
    product_name: 'Product Name',
    category: 'Category',
    unit_of_measure: 'Unit of Measure',
    initial_stock: 'Initial Stock',
    min_stock_level: 'Min. Stock Level',
    primary_supplier: 'Primary Supplier',
    description: 'Description',
    active_status: 'Active Status',

    // Inventory module
    inventory_management: 'Inventory Management',
    stock_movements: 'Stock Movements',
    total_warehouse_value: 'Total Warehouse Value',
    storage_capacity: 'Storage Capacity',
    last_audit: 'Last Audit',
    zone_utilization: 'Zone Utilization',

    // Production logs
    production_log: 'Production Log',
    new_log_entry: 'New Log Entry',
    recent_logs: 'Recent Production Logs',

    // Users module
    user_management: 'User Management',
    manage_roles: 'Manage platform access, roles, and security permissions.',
    invite_user: 'Invite User',
    role_permissions: 'Role Permissions',
    admin_role_desc: 'Full system access. Can manage billing, global settings, and all user accounts.',
    supervisor_role_desc: 'Can view all production data, generate reports, and manage operator schedules.',
    operator_role_desc: 'Limited access to specific production lines. Can log data and view personal metrics.',

    // Reports module
    reports_analytics: 'Reports & Analytics',

    // Settings module
    system_settings: 'System Settings',
    settings_description: 'Manage your account settings, language, and system preferences.',
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

    // Table headers
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

    // Buttons
    save: 'Save Product',
    cancel: 'Cancel',
    submit: 'Submit',
  },
  id: {
    // Navigation & Sidebar
    dashboard: 'Dasbor',
    products: 'Produk',
    production_logs: 'Log Produksi',
    inventory: 'Inventaris',
    reports: 'Laporan',
    users: 'Pengguna',
    settings: 'Pengaturan',
    help: 'Bantuan',
    logout: 'Keluar',
    main_menu: 'Menu Utama',

    // Dashboard page
    executive_dashboard: 'Dasbor Eksekutif',
    smart_control: 'Kontrol Pintar',
    realtime_overview: 'Gambaran real-time operasi manufaktur & inventaris global.',
    refresh: 'Sinkronisasi Data',

    // Header
    search_placeholder: 'Cari operasional, produk, log...',
    export: 'Ekspor',
    new_action: 'Tindakan Baru',
    add_new_product: '+ Tambah Produk Baru',
    record_production: '📝 Catat Produksi',
    record_stock_out: '📦 Catat Stok Keluar',

    // KPI Summary Cards
    total_products: 'Total Produk',
    today_production: 'Produksi Hari Ini',
    current_inventory: 'Inventaris Saat Ini',
    low_stock_alerts: 'Peringatan Stok Rendah',
    production_efficiency: 'Efisiensi Produksi',
    active_catalog: 'Item katalog aktif',
    vs_daily_target: 'vs target harian',
    total_items_in_stock: 'Total barang tersedia',
    require_attention: 'Item butuh perhatian',
    optimal_output: 'Output lini optimal',

    // Charts
    production_analytics: 'Analisis Produksi',
    machine_performance: 'Kinerja Mesin',
    inventory_forecast: 'Proyeksi Inventaris',
    monthly_production_yield: 'Hasil Produksi Bulanan',
    top_products: 'Produk Teratas',

    // Products module
    product_catalog: 'Katalog Produk',
    search_products: 'Cari produk...',
    add_product: 'Tambah Produk',
    product_name: 'Nama Produk',
    category: 'Kategori',
    unit_of_measure: 'Satuan Ukuran',
    initial_stock: 'Stok Awal',
    min_stock_level: 'Batas Minimum Stok',
    primary_supplier: 'Pemasok Utama',
    description: 'Deskripsi',
    active_status: 'Status Aktif',

    // Inventory module
    inventory_management: 'Manajemen Inventaris',
    stock_movements: 'Pergerakan Stok',
    total_warehouse_value: 'Total Nilai Gudang',
    storage_capacity: 'Kapasitas Penyimpanan',
    last_audit: 'Audit Terakhir',
    zone_utilization: 'Utilisasi Zona',

    // Production logs
    production_log: 'Log Produksi',
    new_log_entry: 'Entri Log Baru',
    recent_logs: 'Log Produksi Terbaru',

    // Users module
    user_management: 'Manajemen Pengguna',
    manage_roles: 'Kelola akses platform, peran, dan izin keamanan.',
    invite_user: 'Undang Pengguna',
    role_permissions: 'Izin Peran',
    admin_role_desc: 'Akses penuh sistem. Dapat mengelola billing, pengaturan global, dan semua akun.',
    supervisor_role_desc: 'Dapat melihat semua data produksi, membuat laporan, dan jadwal operator.',
    operator_role_desc: 'Akses terbatas ke lini produksi tertentu. Dapat mencatat data & melihat metrik.',

    // Reports module
    reports_analytics: 'Laporan & Analitik',

    // Settings module
    system_settings: 'Pengaturan Sistem',
    settings_description: 'Kelola pengaturan akun, bahasa, dan preferensi sistem.',
    search_settings: 'Cari pengaturan...',
    select_language: 'Pilih Bahasa Antarmuka',
    language: 'Bahasa',
    language_subtitle: 'Pilih bahasa pusat kontrol yang Anda inginkan.',
    appearance: 'Tampilan',
    appearance_subtitle: 'Sesuaikan tampilan dan nuansa antarmuka.',
    theme: 'Tema',
    theme_dark: 'Gelap',
    theme_light: 'Terang',
    high_contrast: 'Mode Kontras Tinggi',
    high_contrast_desc: 'Tingkatkan kontras untuk keterbacaan lebih baik.',
    profile: 'Profil',
    security: 'Keamanan',
    notifications: 'Notifikasi',
    system: 'Sistem',
    configuration: 'Konfigurasi',
    config_active: 'Opsi konfigurasi untuk',
    config_active_suffix: 'sedang aktif.',
    system_roles: 'Peran Sistem',
    manage_user_access: 'Kelola akses dan izin pengguna.',
    add_user: 'Tambah Pengguna',
    save_preferences: 'Simpan Preferensi',

    // Table headers
    time: 'Waktu',
    operator: 'Operator',
    machine_id: 'ID Mesin',
    quantity: 'Jumlah',
    status: 'Status',
    last_activity: 'Aktivitas Terakhir',
    actions: 'Aksi',
    role: 'Peran',
    user: 'Pengguna',
    last_login: 'Login Terakhir',

    // Buttons
    save: 'Simpan Produk',
    cancel: 'Batal',
    submit: 'Kirim',
  },
  ar: {
    // Navigation & Sidebar
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    production_logs: 'سجلات الإنتاج',
    inventory: 'المخزون',
    reports: 'التقارير',
    users: 'المستخدمون',
    settings: 'الإعدادات',
    help: 'المساعدة',
    logout: 'تسجيل الخروج',
    main_menu: 'القائمة الرئيسية',

    // Dashboard page
    executive_dashboard: 'لوحة التحكم التنفيذية',
    smart_control: 'التحكم الذكي',
    realtime_overview: 'نظرة عامة فورية على عمليات التصنيع والمخزون.',
    refresh: 'تزامن البيانات',

    // Header
    search_placeholder: 'ابحث في العمليات، المنتجات، السجلات...',
    export: 'تصدير',
    new_action: 'إجراء جديد',
    add_new_product: '+ إضافة منتج',
    record_production: '📝 تسجيل إنتاج',
    record_stock_out: '📦 تسجيل صادر',

    // KPI Summary Cards
    total_products: 'إجمالي المنتجات',
    today_production: 'إنتاج اليوم',
    current_inventory: 'المخزون الحالي',
    low_stock_alerts: 'تنبيهات المخزون المنخفض',
    production_efficiency: 'كفاءة الإنتاج',
    active_catalog: 'عناصر الكتالوج النشطة',
    vs_daily_target: 'مقارنة بالهدف اليومي',
    total_items_in_stock: 'إجمالي العناصر المتوفرة',
    require_attention: 'عناصر تحتاج اهتماماً',
    optimal_output: 'مخرجات الخط الأمثل',

    // Charts
    production_analytics: 'تحليلات الإنتاج',
    machine_performance: 'أداء الآلات',
    inventory_forecast: 'توقعات المخزون',
    monthly_production_yield: 'إنتاجية الشهر',
    top_products: 'أفضل المنتجات',

    // Products module
    product_catalog: 'كتالوج المنتجات',
    search_products: 'ابحث عن منتج...',
    add_product: 'إضافة منتج',
    product_name: 'اسم المنتج',
    category: 'الفئة',
    unit_of_measure: 'وحدة القياس',
    initial_stock: 'المخزون الأولي',
    min_stock_level: 'الحد الأدنى للمخزون',
    primary_supplier: 'المورد الرئيسي',
    description: 'الوصف',
    active_status: 'الحالة',

    // Inventory module
    inventory_management: 'إدارة المخزون',
    stock_movements: 'حركات المخزون',
    total_warehouse_value: 'إجمالي قيمة المستودع',
    storage_capacity: 'سعة التخزين',
    last_audit: 'آخر مراجعة',
    zone_utilization: 'استخدام المنطقة',

    // Production logs
    production_log: 'سجل الإنتاج',
    new_log_entry: 'إدخال سجل جديد',
    recent_logs: 'أحدث سجلات الإنتاج',

    // Users module
    user_management: 'إدارة المستخدمين',
    manage_roles: 'إدارة الصلاحيات والأدوار وإعدادات الأمان.',
    invite_user: 'دعوة مستخدم',
    role_permissions: 'أذونات الأدوار',
    admin_role_desc: 'وصول كامل. إدارة الفواتير والإعدادات وحسابات المستخدمين.',
    supervisor_role_desc: 'عرض بيانات الإنتاج وإنشاء التقارير وإدارة الجداول.',
    operator_role_desc: 'وصول محدود. تسجيل البيانات والاطلاع على المقاييس الشخصية.',

    // Reports module
    reports_analytics: 'التقارير والتحليلات',

    // Settings module
    system_settings: 'إعدادات النظام',
    settings_description: 'إدارة إعدادات الحساب واللغة وتفضيلات النظام.',
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
    high_contrast_desc: 'تحسين التباين لقراءة أفضل في الإضاءة القاسية.',
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

    // Table headers
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

    // Buttons
    save: 'حفظ المنتج',
    cancel: 'إلغاء',
    submit: 'إرسال',
  },
  es: {
    // Navigation & Sidebar
    dashboard: 'Panel de Control',
    products: 'Productos',
    production_logs: 'Registros de Producción',
    inventory: 'Inventario',
    reports: 'Informes',
    users: 'Usuarios',
    settings: 'Configuración',
    help: 'Ayuda',
    logout: 'Cerrar Sesión',
    main_menu: 'Menú Principal',

    // Dashboard page
    executive_dashboard: 'Panel Ejecutivo',
    smart_control: 'Control Inteligente',
    realtime_overview: 'Resumen en tiempo real de operaciones de fabricación e inventario global.',
    refresh: 'Sincronizar Datos',

    // Header
    search_placeholder: 'Buscar operaciones, productos, registros...',
    export: 'Exportar',
    new_action: 'Nueva Acción',
    add_new_product: '+ Añadir Producto',
    record_production: '📝 Registrar Producción',
    record_stock_out: '📦 Registrar Salida',

    // KPI Summary Cards
    total_products: 'Total de Productos',
    today_production: 'Producción de Hoy',
    current_inventory: 'Inventario Actual',
    low_stock_alerts: 'Alertas de Stock Bajo',
    production_efficiency: 'Eficiencia de Producción',
    active_catalog: 'Artículos activos en catálogo',
    vs_daily_target: 'vs objetivo diario',
    total_items_in_stock: 'Total de artículos en stock',
    require_attention: 'Artículos requieren atención',
    optimal_output: 'Rendimiento óptimo de línea',

    // Charts
    production_analytics: 'Analítica de Producción',
    machine_performance: 'Rendimiento de Máquinas',
    inventory_forecast: 'Pronóstico de Inventario',
    monthly_production_yield: 'Rendimiento Mensual',
    top_products: 'Productos Principales',

    // Products module
    product_catalog: 'Catálogo de Productos',
    search_products: 'Buscar productos...',
    add_product: 'Añadir Producto',
    product_name: 'Nombre del Producto',
    category: 'Categoría',
    unit_of_measure: 'Unidad de Medida',
    initial_stock: 'Stock Inicial',
    min_stock_level: 'Nivel Mínimo de Stock',
    primary_supplier: 'Proveedor Principal',
    description: 'Descripción',
    active_status: 'Estado Activo',

    // Inventory module
    inventory_management: 'Gestión de Inventario',
    stock_movements: 'Movimientos de Stock',
    total_warehouse_value: 'Valor Total del Almacén',
    storage_capacity: 'Capacidad de Almacenamiento',
    last_audit: 'Última Auditoría',
    zone_utilization: 'Utilización de Zona',

    // Production logs
    production_log: 'Registro de Producción',
    new_log_entry: 'Nueva Entrada de Registro',
    recent_logs: 'Registros de Producción Recientes',

    // Users module
    user_management: 'Gestión de Usuarios',
    manage_roles: 'Gestionar accesos, roles y permisos de seguridad.',
    invite_user: 'Invitar Usuario',
    role_permissions: 'Permisos de Rol',
    admin_role_desc: 'Acceso total al sistema. Configuración global y gestión de cuentas.',
    supervisor_role_desc: 'Ver datos de producción, generar informes y gestionar horarios.',
    operator_role_desc: 'Acceso limitado a líneas de producción específicas.',

    // Reports module
    reports_analytics: 'Informes y Analítica',

    // Settings module
    system_settings: 'Configuración del Sistema',
    settings_description: 'Administra la configuración de tu cuenta, idioma y preferencias del sistema.',
    search_settings: 'Buscar configuraciones...',
    select_language: 'Seleccionar Idioma de Interfaz',
    language: 'Idioma',
    language_subtitle: 'Elige tu idioma preferido para el centro de control.',
    appearance: 'Apariencia',
    appearance_subtitle: 'Personaliza el aspecto y la sensación de la interfaz.',
    theme: 'Tema',
    theme_dark: 'Oscuro',
    theme_light: 'Claro',
    high_contrast: 'Modo de Alto Contraste',
    high_contrast_desc: 'Aumenta el contraste para mejor legibilidad con luz intensa.',
    profile: 'Perfil',
    security: 'Seguridad',
    notifications: 'Notificaciones',
    system: 'Sistema',
    configuration: 'Configuración',
    config_active: 'Opciones de configuración para',
    config_active_suffix: 'están activas.',
    system_roles: 'Roles del Sistema',
    manage_user_access: 'Gestionar acceso y permisos de usuarios.',
    add_user: 'Añadir Usuario',
    save_preferences: 'Guardar Preferencias',

    // Table headers
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

    // Buttons
    save: 'Guardar Producto',
    cancel: 'Cancelar',
    submit: 'Enviar',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('forge_lang') as Language
    if (savedLang && ['en', 'id', 'ar', 'es'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('forge_lang', lang)
  }

  const isRTL = language === 'ar'

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div
        dir={mounted && isRTL ? 'rtl' : 'ltr'}
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
