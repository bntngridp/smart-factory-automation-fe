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
    // Navigation & Headers
    dashboard: 'Dashboard',
    products: 'Products',
    production_logs: 'Production Logs',
    inventory: 'Inventory',
    reports: 'Reports',
    users: 'Users',
    settings: 'Settings',
    help: 'Help',
    logout: 'Logout',
    executive_dashboard: 'Executive Dashboard',
    smart_control: 'Smart Control Center',
    realtime_overview: 'Real-time overview of global manufacturing operations & inventory.',

    // Header & Quick Actions
    search_placeholder: 'Search operations, products, logs...',
    export: 'Export',
    new_action: 'New Action',
    add_new_product: '+ Add New Product',
    record_production: '📝 Record Production',
    record_stock_out: '📦 Record Stock Out',

    // Summary KPI Cards
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

    // Charts & Analytics
    production_analytics: 'Production Analytics',
    machine_performance: 'Machine Performance Heatmap',
    inventory_forecast: 'Inventory Forecast',
    monthly_production_yield: 'Monthly Production Yield',
    top_products: 'Top Products',

    // User Management
    user_management: 'User Management',
    manage_roles: 'Manage platform access, roles, and security permissions.',
    invite_user: 'Invite User',
    role_permissions: 'Role Permissions',
    admin_role_desc: 'Full system access. Can manage billing, global settings, and all user accounts.',
    supervisor_role_desc: 'Can view all production data, generate reports, and manage operator schedules.',
    operator_role_desc: 'Limited access to specific production lines. Can log data and view personal metrics.',

    // Settings
    system_settings: 'System Settings',
    select_language: 'Select Interface Language',
    language: 'Language',
    appearance: 'Appearance',
    theme_preferences: 'Theme Preferences',
    high_contrast: 'High Contrast Mode',
    save_preferences: 'Save Preferences',

    // Form Labels & Modals
    product_name: 'Product Name',
    category: 'Category',
    unit_of_measure: 'Unit of Measure',
    initial_stock: 'Initial Stock',
    min_stock_level: 'Min. Stock Level',
    primary_supplier: 'Primary Supplier',
    description: 'Description',
    active_status: 'Active Status',
    save: 'Save Product',
    cancel: 'Cancel',
    submit: 'Submit Log',
    refresh: 'Refresh',

    // Common Table Headers
    time: 'Time',
    operator: 'Operator',
    machine_id: 'Machine ID',
    quantity: 'Quantity',
    status: 'Status',
    last_activity: 'Last Activity',
    actions: 'Actions',
  },
  id: {
    // Navigation & Headers
    dashboard: 'Dasbor',
    products: 'Produk Master',
    production_logs: 'Log Produksi',
    inventory: 'Inventaris',
    reports: 'Laporan & Analitis',
    users: 'Pengguna',
    settings: 'Pengaturan',
    help: 'Bantuan',
    logout: 'Keluar',
    executive_dashboard: 'Dasbor Eksekutif',
    smart_control: 'Pusat Kontrol Pintar',
    realtime_overview: 'Gambaran umum real-time operasi manufaktur & inventaris global.',

    // Header & Quick Actions
    search_placeholder: 'Cari operasional, produk, log...',
    export: 'Ekspor',
    new_action: 'Tindakan Baru',
    add_new_product: '+ Tambah Produk Baru',
    record_production: '📝 Catat Hasil Produksi',
    record_stock_out: '📦 Catat Stok Keluar',

    // Summary KPI Cards
    total_products: 'Total Produk',
    today_production: 'Produksi Hari Ini',
    current_inventory: 'Stok Inventaris Saat Ini',
    low_stock_alerts: 'Peringatan Stok Rendah',
    production_efficiency: 'Efisiensi Produksi',
    active_catalog: 'Item katalog aktif',
    vs_daily_target: 'vs target harian',
    total_items_in_stock: 'Total barang tersedia',
    require_attention: 'Item butuh perhatian',
    optimal_output: 'Output lini optimal',

    // Charts & Analytics
    production_analytics: 'Analisis Produksi',
    machine_performance: 'Peta Kinerja Mesin',
    inventory_forecast: 'Perkiraan Inventaris',
    monthly_production_yield: 'Hasil Produksi Bulanan',
    top_products: 'Produk Teratas',

    // User Management
    user_management: 'Manajemen Pengguna',
    manage_roles: 'Kelola akses platform, peran, dan izin keamanan.',
    invite_user: 'Undang Pengguna',
    role_permissions: 'Izin Peran',
    admin_role_desc: 'Akses penuh sistem. Dapat mengelola billing, pengaturan global, dan semua akun.',
    supervisor_role_desc: 'Dapat melihat semua data produksi, membuat laporan, dan jadwal operator.',
    operator_role_desc: 'Akses terbatas ke lini produksi tertentu. Dapat mencatat data & melihat metrik.',

    // Settings
    system_settings: 'Pengaturan Sistem',
    select_language: 'Pilih Bahasa Antarmuka',
    language: 'Bahasa',
    appearance: 'Tampilan',
    theme_preferences: 'Preferensi Tema',
    high_contrast: 'Mode Kontras Tinggi',
    save_preferences: 'Simpan Preferensi',

    // Form Labels & Modals
    product_name: 'Nama Produk',
    category: 'Kategori',
    unit_of_measure: 'Satuan Ukuran',
    initial_stock: 'Stok Awal',
    min_stock_level: 'Batas Minimum Stok',
    primary_supplier: 'Pemasok Utama',
    description: 'Deskripsi',
    active_status: 'Status Aktif',
    save: 'Simpan Produk',
    cancel: 'Batal',
    submit: 'Kirim Log',
    refresh: 'Muat Ulang',

    // Common Table Headers
    time: 'Waktu',
    operator: 'Operator',
    machine_id: 'ID Mesin',
    quantity: 'Jumlah',
    status: 'Status',
    last_activity: 'Aktivitas Terakhir',
    actions: 'Aksi',
  },
  ar: {
    // Navigation & Headers
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    production_logs: 'سجلات الإنتاج',
    inventory: 'المخزون',
    reports: 'التقارير والتحليلات',
    users: 'المستخدمون',
    settings: 'الإعدادات',
    help: 'المساعدة',
    logout: 'تسجيل الخروج',
    executive_dashboard: 'لوحة التحكم التنفيذية',
    smart_control: 'مركز التحكم الذكي',
    realtime_overview: 'نظرة عامة في الوقت الفعلي على عمليات التصنيع والمخزون.',

    // Header & Quick Actions
    search_placeholder: 'ابحث في العمليات، المنتجات، السجلات...',
    export: 'تصدير',
    new_action: 'إجراء جديد',
    add_new_product: '+ إضافة منتج جديد',
    record_production: '📝 تسجيل الإنتاج',
    record_stock_out: '📦 تسجيل الصادر',

    // Summary KPI Cards
    total_products: 'إجمالي المنتجات',
    today_production: 'إنتاج اليوم',
    current_inventory: 'المخزون الحالي',
    low_stock_alerts: 'تنبيهات انخفاض المخزون',
    production_efficiency: 'كفاءة الإنتاج',
    active_catalog: 'منتجات الكتالوج النشطة',
    vs_daily_target: 'مقارنة بالهدف اليومي',
    total_items_in_stock: 'إجمالي العناصر في المخزن',
    require_attention: 'عناصر تتطلب اهتمامًا',
    optimal_output: 'مخرجات خط الإنتاج المثالية',

    // Charts & Analytics
    production_analytics: 'تحليلات الإنتاج',
    machine_performance: 'خريطة أداء الآلات',
    inventory_forecast: 'توقعات المخزون',
    monthly_production_yield: 'إنتاجية الشهر',
    top_products: 'أفضل المنتجات',

    // User Management
    user_management: 'إدارة المستخدمين',
    manage_roles: 'إدارة الوصول إلى المنصة والأدوار والأذونات.',
    invite_user: 'دعوة مستخدم',
    role_permissions: 'أذونات الأدوار',
    admin_role_desc: 'وصول كامل للنظام. إدارة الفواتير والإعدادات وحسابات المستخدمين.',
    supervisor_role_desc: 'عرض بيانات الإنتاج وإنشاء التقارير وإدارة الجداول الزمني.',
    operator_role_desc: 'وصول محدود لخطوط إنتاج محددة. تسجيل البيانات والمقاييس الشخصية.',

    // Settings
    system_settings: 'إعدادات النظام',
    select_language: 'اختر لغة الواجهة',
    language: 'اللغة',
    appearance: 'المظهر',
    theme_preferences: 'تفضيلات المظهر',
    high_contrast: 'وضع التباين العالي',
    save_preferences: 'حفظ التفضيلات',

    // Form Labels & Modals
    product_name: 'اسم المنتج',
    category: 'الفئة',
    unit_of_measure: 'وحدة القياس',
    initial_stock: 'المخزون الأولي',
    min_stock_level: 'الحد الأدنى للمخزون',
    primary_supplier: 'المورد الرئيسي',
    description: 'الوصف',
    active_status: 'الحالة النشطة',
    save: 'حفظ المنتج',
    cancel: 'إلغاء',
    submit: 'إرسال السجل',
    refresh: 'تحديث',

    // Common Table Headers
    time: 'الوقت',
    operator: 'المشغل',
    machine_id: 'معرف الآلة',
    quantity: 'الكمية',
    status: 'الحالة',
    last_activity: 'آخر نشاط',
    actions: 'الإجراءات',
  },
  es: {
    // Navigation & Headers
    dashboard: 'Panel de Control',
    products: 'Productos',
    production_logs: 'Registros de Producción',
    inventory: 'Inventario',
    reports: 'Informes y Analítica',
    users: 'Usuarios',
    settings: 'Configuración',
    help: 'Ayuda',
    logout: 'Cerrar Sesión',
    executive_dashboard: 'Panel Ejecutivo',
    smart_control: 'Centro de Control Inteligente',
    realtime_overview: 'Resumen en tiempo real de operaciones de fabricación e inventario global.',

    // Header & Quick Actions
    search_placeholder: 'Buscar operaciones, productos, registros...',
    export: 'Exportar',
    new_action: 'Nueva Acción',
    add_new_product: '+ Añadir Nuevo Producto',
    record_production: '📝 Registrar Producción',
    record_stock_out: '📦 Registrar Salida',

    // Summary KPI Cards
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

    // Charts & Analytics
    production_analytics: 'Analítica de Producción',
    machine_performance: 'Mapa de Rendimiento de Máquinas',
    inventory_forecast: 'Pronóstico de Inventario',
    monthly_production_yield: 'Rendimiento Mensual',
    top_products: 'Productos Principales',

    // User Management
    user_management: 'Gestión de Usuarios',
    manage_roles: 'Gestionar accesos, roles y permisos de seguridad.',
    invite_user: 'Invitar Usuario',
    role_permissions: 'Permisos de Rol',
    admin_role_desc: 'Acceso total al sistema. Configuración global y gestión de cuentas.',
    supervisor_role_desc: 'Ver datos de producción, generar informes y gestionar horarios.',
    operator_role_desc: 'Acceso limitado a líneas de producción específicas y registro de datos.',

    // Settings
    system_settings: 'Configuración del Sistema',
    select_language: 'Seleccionar Idioma de Interfaz',
    language: 'Idioma',
    appearance: 'Apariencia',
    theme_preferences: 'Preferencias de Tema',
    high_contrast: 'Modo de Alto Contraste',
    save_preferences: 'Guardar Preferencias',

    // Form Labels & Modals
    product_name: 'Nombre del Producto',
    category: 'Categoría',
    unit_of_measure: 'Unidad de Medida',
    initial_stock: 'Stock Inicial',
    min_stock_level: 'Nivel Mínimo de Stock',
    primary_supplier: 'Proveedor Principal',
    description: 'Descripción',
    active_status: 'Estado Activo',
    save: 'Guardar Producto',
    cancel: 'Cancelar',
    submit: 'Enviar Registro',
    refresh: 'Actualizar',

    // Common Table Headers
    time: 'Hora',
    operator: 'Operador',
    machine_id: 'ID de Máquina',
    quantity: 'Cantidad',
    status: 'Estado',
    last_activity: 'Última Actividad',
    actions: 'Acciones',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('forge_lang') as Language
      if (savedLang && ['en', 'id', 'ar', 'es'].includes(savedLang)) {
        setLanguageState(savedLang)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('forge_lang', lang)
    }
  }

  const isRTL = language === 'ar'

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>
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
