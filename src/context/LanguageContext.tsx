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
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    production_logs: 'Production Logs',
    inventory: 'Inventory',
    reports: 'Reports',
    users: 'Users',
    settings: 'Settings',
    help: 'Help',
    logout: 'Logout',
    // Header
    search_placeholder: 'Search operations, products, logs...',
    export: 'Export',
    new_action: 'New Action',
    // Actions & Buttons
    add_new_product: '+ Add New Product',
    record_production: '📝 Record Production',
    record_stock_out: '📦 Record Stock Out',
    save_product: 'Save Product',
    cancel: 'Cancel',
    submit: 'Submit Log',
    refresh: 'Refresh',
    // Settings & Language
    language: 'Language',
    select_language: 'Select Interface Language',
    appearance: 'Appearance',
    theme: 'Theme Preferences',
    // General
    status: 'Status',
    quantity: 'Quantity',
    operator: 'Operator',
    product_name: 'Product Name',
    active: 'Active',
    inactive: 'Inactive',
  },
  id: {
    // Navigation
    dashboard: 'Dasbor',
    products: 'Produk Master',
    production_logs: 'Log Produksi',
    inventory: 'Inventaris',
    reports: 'Laporan & Analitis',
    users: 'Pengguna',
    settings: 'Pengaturan',
    help: 'Bantuan',
    logout: 'Keluar',
    // Header
    search_placeholder: 'Cari operasional, produk, log...',
    export: 'Ekspor',
    new_action: 'Tindakan Baru',
    // Actions & Buttons
    add_new_product: '+ Tambah Produk Baru',
    record_production: '📝 Catat Hasil Produksi',
    record_stock_out: '📦 Catat Stok Keluar',
    save_product: 'Simpan Produk',
    cancel: 'Batal',
    submit: 'Kirim Log',
    refresh: 'Muat Ulang',
    // Settings & Language
    language: 'Bahasa',
    select_language: 'Pilih Bahasa Antarmuka',
    appearance: 'Tampilan',
    theme: 'Preferensi Tema',
    // General
    status: 'Status',
    quantity: 'Jumlah',
    operator: 'Operator',
    product_name: 'Nama Produk',
    active: 'Aktif',
    inactive: 'Non-aktif',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    production_logs: 'سجلات الإنتاج',
    inventory: 'المخزون',
    reports: 'التقارير والتحليلات',
    users: 'المستخدمون',
    settings: 'الإعدادات',
    help: 'المساعدة',
    logout: 'تسجيل الخروج',
    // Header
    search_placeholder: 'ابحث في العمليات، المنتجات، السجلات...',
    export: 'تصدير',
    new_action: 'إجراء جديد',
    // Actions & Buttons
    add_new_product: '+ إضافة منتج جديد',
    record_production: '📝 تسجيل الإنتاج',
    record_stock_out: '📦 تسجيل الصادر',
    save_product: 'حفظ المنتج',
    cancel: 'إلغاء',
    submit: 'إرسال السجل',
    refresh: 'تحديث',
    // Settings & Language
    language: 'اللغة',
    select_language: 'اختر لغة الواجهة',
    appearance: 'المظهر',
    theme: 'تفضيلات المظهر',
    // General
    status: 'الحالة',
    quantity: 'الكمية',
    operator: 'المشغل',
    product_name: 'اسم المنتج',
    active: 'نشط',
    inactive: 'غير نشط',
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    products: 'Productos',
    production_logs: 'Registros de Producción',
    inventory: 'Inventario',
    reports: 'Informes y Analítica',
    users: 'Usuarios',
    settings: 'Configuración',
    help: 'Ayuda',
    logout: 'Cerrar Sesión',
    // Header
    search_placeholder: 'Buscar operaciones, productos, registros...',
    export: 'Exportar',
    new_action: 'Nueva Acción',
    // Actions & Buttons
    add_new_product: '+ Añadir Nuevo Producto',
    record_production: '📝 Registrar Producción',
    record_stock_out: '📦 Registrar Salida',
    save_product: 'Guardar Producto',
    cancel: 'Cancelar',
    submit: 'Enviar Registro',
    refresh: 'Actualizar',
    // Settings & Language
    language: 'Idioma',
    select_language: 'Seleccionar Idioma de la Interfaz',
    appearance: 'Apariencia',
    theme: 'Preferencias de Tema',
    // General
    status: 'Estado',
    quantity: 'Cantidad',
    operator: 'Operador',
    product_name: 'Nombre del Producto',
    active: 'Activo',
    inactive: 'Inactivo',
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
