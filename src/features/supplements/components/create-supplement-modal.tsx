// src/features/supplements/components/create-supplement-modal.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, Upload, X, ChevronDown, Leaf, Plus, Tag, FileText, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supplementsService, type CreateSupplementDto, type SupplementBrand } from "../services/supplements.service"
import type { SupplementCategory, Supplement } from "../types/supplement"

interface CreateSupplementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  editingSupplement?: Supplement | null
}

const CATEGORIES: { value: SupplementCategory; label: string }[] = [
  { value: "PROTEIN", label: "Proteínas" },
  { value: "VITAMINS", label: "Vitaminas" },
  { value: "CREATINE", label: "Creatina" },
  { value: "PRE_WORKOUT", label: "Pre-entreno" },
  { value: "FAT_BURNER", label: "Quemadores de grasa" },
  { value: "AMINO_ACIDS", label: "Aminoácidos" },
  { value: "OTHER", label: "Otros" },
]

// Constante para la opción de crear nueva marca (partial type sin logoUrl)
const NEW_BRAND_OPTION: SupplementBrand = { id: "brand-new", name: "Crear nueva marca", logoUrl: null }

interface FormData {
  // Requeridos
  brandId: string
  name: string
  description: string
  category: SupplementCategory
  price: string
  subscriberPrice: string
  stock: string
  servingSize: string
  // Opcionales
  usageInstructions: string
  nutrition: {
    servingsPerContainer: string
    calories: string
    protein: string
    carbs: string
    fat: string
  }
}

const initialFormData: FormData = {
  brandId: "",
  name: "",
  description: "",
  category: "PROTEIN",
  price: "",
  subscriberPrice: "",
  stock: "",
  servingSize: "",
  usageInstructions: "",
  nutrition: {
    servingsPerContainer: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  },
}

// Custom Select Component
function CustomSelect({
  value,
  onChange,
  placeholder,
  options,
  error,
  label,
  required,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  error?: string
  label?: string
  required?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="grid gap-2">
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full h-9 px-3 py-1.5 rounded-md border text-sm transition-all duration-200 ${
            error
              ? "border-destructive ring-2 ring-destructive/20"
              : "border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          } bg-transparent hover:border-primary/50 focus:outline-none`}
        >
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption?.label || placeholder || "Seleccionar..."}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors ${
                  option.value === value ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive animate-in slide-in-from-top-1">{error}</p>
      )}
    </div>
  )
}

// Custom Textarea Component
function CustomTextarea({
  value,
  onChange,
  placeholder,
  error,
  label,
  required,
  rows = 3,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  label?: string
  required?: boolean
  rows?: number
}) {
  return (
    <div className="grid gap-2">
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-all duration-200 resize-none focus-visible:outline-none focus-visible:ring-[3px] ${
          error
            ? "border-destructive ring-2 ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/30"
            : "border-input focus-visible:border-ring focus-visible:ring-ring/50"
        } bg-transparent placeholder:text-muted-foreground`}
      />
      {error && (
        <p className="text-xs text-destructive animate-in slide-in-from-top-1">{error}</p>
      )}
    </div>
  )
}

// Section Card Component
function SectionCard({
  title,
  children,
  icon,
}: {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="relative bg-card dark:bg-card/50 rounded-2xl border border-border/60 p-5 transition-all duration-300 hover:border-border hover:shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-2xl opacity-50" />
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
        <h3 className="font-display text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export function CreateSupplementModal({
  open,
  onOpenChange,
  onSuccess,
  editingSupplement,
}: CreateSupplementModalProps) {
  const isEditing = !!editingSupplement
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para brands (cargadas del backend)
  const [brands, setBrands] = useState<SupplementBrand[]>([])
  const [brandsLoading, setBrandsLoading] = useState(false)
  const [showNewBrandInput, setShowNewBrandInput] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")
  const [isCreatingBrand, setIsCreatingBrand] = useState(false)

  // Cargar brands cuando el modal se abre
  const loadBrands = async () => {
    setBrandsLoading(true)
    try {
      const backendBrands = await supplementsService.getBrands()
      setBrands([...backendBrands, NEW_BRAND_OPTION])
    } catch (error) {
      console.error("Error loading brands:", error)
      // Si falla, usar lista vacía (solo-opción crear nueva)
      setBrands([NEW_BRAND_OPTION])
    } finally {
      setBrandsLoading(false)
    }
  }

  // useEffect para cargar brands cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadBrands()
    }
  }, [open])

  // Cargar datos del supplement si estamos editando
  useEffect(() => {
    if (editingSupplement) {
      setFormData({
        brandId: editingSupplement.brand.id,
        name: editingSupplement.name,
        description: editingSupplement.description,
        category: editingSupplement.category,
        price: editingSupplement.price?.toString() || "",
        subscriberPrice: editingSupplement.subscriberPrice?.toString() || "",
        stock: editingSupplement.stock?.toString() || "",
        servingSize: editingSupplement.servingSize || "",
        usageInstructions: editingSupplement.usageInstructions || "",
        nutrition: {
          servingsPerContainer: editingSupplement.nutrition?.servingsPerContainer?.toString() || "",
          calories: editingSupplement.nutrition?.calories?.toString() || "",
          protein: editingSupplement.nutrition?.protein?.toString() || "",
          carbs: editingSupplement.nutrition?.carbs?.toString() || "",
          fat: editingSupplement.nutrition?.fat?.toString() || "",
        },
      })
      //如果有图片，也设置预览
      if (editingSupplement.images?.[0]?.url) {
        setImagePreview(editingSupplement.images[0].url)
      }
    } else {
      resetForm()
    }
  }, [editingSupplement])

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNutritionChange = (
    field: keyof FormData["nutrition"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      nutrition: { ...prev.nutrition, [field]: value },
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleBrandChange = (brandId: string) => {
    if (brandId === "brand-new") {
      setShowNewBrandInput(true)
      setNewBrandName("")
    } else {
      setShowNewBrandInput(false)
      setNewBrandName("")
      handleInputChange("brandId", brandId)
    }
  }

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      setErrors((prev) => ({ ...prev, newBrand: "El nombre de la marca es requerido" }))
      return
    }

    setIsCreatingBrand(true)
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.newBrand
      return newErrors
    })

    try {
      const newBrand = await supplementsService.createBrand({ name: newBrandName.trim() })

      // Agregar la nueva marca a la lista (antes de la opción "Crear nueva marca")
      setBrands((prev) => [
        newBrand,
        ...prev.filter((b) => b.id !== "brand-new"),
      ])

      // Seleccionar automáticamente la nueva marca
      handleInputChange("brandId", newBrand.id)
      setShowNewBrandInput(false)
      setNewBrandName("")
    } catch (error) {
      console.error("Error creating brand:", error)
      setErrors((prev) => ({ ...prev, newBrand: "Error al crear la marca. Intenta de nuevo." }))
    } finally {
      setIsCreatingBrand(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.brandId) newErrors.brandId = "La marca es requerida"
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida"
    if (!formData.category) newErrors.category = "La categoría es requerida"
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio es requerido y debe ser mayor a 0"
    }
    if (!formData.subscriberPrice || parseFloat(formData.subscriberPrice) <= 0) {
      newErrors.subscriberPrice = "El precio suscriptor es requerido"
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock es requerido"
    }
    if (!formData.servingSize.trim()) {
      newErrors.servingSize = "El tamaño de porción es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setImageFile(null)
    setImagePreview(null)
    setErrors({})
    setShowNewBrandInput(false)
    setNewBrandName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Crear el supplement
      const createData: CreateSupplementDto = {
        brandId: formData.brandId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        subscriberPrice: parseFloat(formData.subscriberPrice),
        stock: parseInt(formData.stock),
        servingSize: formData.servingSize.trim(),
        usageInstructions: formData.usageInstructions.trim() || "",
        images: [],
        nutrition: {
          servingsPerContainer: parseInt(formData.nutrition.servingsPerContainer) || 0,
          calories: parseInt(formData.nutrition.calories) || 0,
          protein: parseInt(formData.nutrition.protein) || 0,
          carbs: parseInt(formData.nutrition.carbs) || 0,
          fat: parseInt(formData.nutrition.fat) || 0,
        },
      }

      console.log("Datos a enviar:", JSON.stringify(createData, null, 2))

      if (isEditing && editingSupplement) {
        // Actualizar supplement existente
        await supplementsService.updateSupplement(editingSupplement.id, createData)
        
        // Subir imagen si existe y es diferente
        if (imageFile && editingSupplement.id) {
          await supplementsService.uploadImage(editingSupplement.id, imageFile, 0)
        }
      } else {
        // Crear nuevo supplement
        const created = await supplementsService.createSupplement(createData)

        // Subir imagen si existe
        if (imageFile && created.id) {
          await supplementsService.uploadImage(created.id, imageFile, 0)
        }
      }

      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error("Error creating supplement:", error)
      setErrors({ submit: "Error al crear el suplemento. Intenta de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <DialogTitle className="text-2xl font-display font-bold text-foreground">
              {isEditing ? "Editar Suplemento" : "Crear Nuevo Suplemento"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            {isEditing 
              ? "Modifica los datos del suplemento. Los campos marcados con <span className='text-destructive font-medium'>*</span> son requeridos."
              : "Completa los datos del suplemento. Los campos marcados con <span className='text-destructive font-medium'>*</span> son requeridos."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sección: Información Principal */}
          <SectionCard title="Información Principal" icon={<Leaf className="w-4 h-4" />}>
            {/* Brand */}
            {brandsLoading ? (
              <div className="grid gap-2">
                <Label>Marca</Label>
                <div className="flex items-center gap-2 h-9 px-3 py-1.5 rounded-md border bg-muted/50 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando marcas...
                </div>
              </div>
            ) : (
              <CustomSelect
                label="Marca"
                required
                value={formData.brandId}
                onChange={(value) => handleBrandChange(value)}
                placeholder="Selecciona una marca"
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
                error={errors.brandId}
              />
            )}

            {/* Nueva marca input */}
            {showNewBrandInput && (
              <div className="grid gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <Label htmlFor="newBrand">
                  Nombre de la nueva marca <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="newBrand"
                    placeholder="Ej: MusclePharm"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleCreateBrand()
                      }
                    }}
                    disabled={isCreatingBrand}
                    className={errors.newBrand ? "border-destructive ring-2 ring-destructive/20" : ""}
                  />
                  <Button
                    type="button"
                    onClick={handleCreateBrand}
                    disabled={isCreatingBrand || !newBrandName.trim()}
                    className="shrink-0 bg-primary hover:bg-primary/90"
                  >
                    {isCreatingBrand ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Crear
                      </>
                    )}
                  </Button>
                </div>
                {errors.newBrand && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.newBrand}</p>
                )}
              </div>
            )}

            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej: Whey Gold Standard 100% Whey"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive ring-2 ring-destructive/20" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <CustomTextarea
              label="Descripción"
              required
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              placeholder="Describe el producto, sus beneficios y características..."
              rows={3}
              error={errors.description}
            />

            {/* Categoría */}
            <CustomSelect
              label="Categoría"
              required
              value={formData.category}
              onChange={(value) => handleInputChange("category", value as SupplementCategory)}
              placeholder="Selecciona una categoría"
              options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              error={errors.category}
            />
          </SectionCard>

          {/* Sección: Precios y Stock */}
          <SectionCard title="Precios y Stock" icon={<Tag className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Precio */}
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Precio regular ($) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="pl-7"
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.price}</p>
                )}
              </div>

              {/* Precio Suscriptor */}
              <div className="grid gap-2">
                <Label htmlFor="subscriberPrice">
                  Precio Suscriptor ($) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="subscriberPrice"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.subscriberPrice}
                    onChange={(e) => handleInputChange("subscriberPrice", e.target.value)}
                    className="pl-7"
                  />
                </div>
                {errors.subscriberPrice && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.subscriberPrice}</p>
                )}
              </div>

              {/* Stock */}
              <div className="grid gap-2">
                <Label htmlFor="stock">
                  Stock <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.stock}</p>
                )}
              </div>

              {/* Serving Size */}
              <div className="grid gap-2">
                <Label htmlFor="servingSize">
                  Tamaño de porción <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="servingSize"
                  placeholder="Ej: 30g, 1 scoop"
                  value={formData.servingSize}
                  onChange={(e) => handleInputChange("servingSize", e.target.value)}
                />
                {errors.servingSize && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.servingSize}</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Sección: Información Adicional (Opcional) */}
          <SectionCard title="Información Adicional (Opcional)" icon={<FileText className="w-4 h-4" />}>
            {/* Modo de uso */}
            <CustomTextarea
              label="Modo de uso"
              value={formData.usageInstructions}
              onChange={(value) => handleInputChange("usageInstructions", value)}
              placeholder="Instrucciones de uso, precauciones, etc."
              rows={2}
            />

            {/* Nutrición */}
            <div className="grid gap-3">
              <Label>Nutrición (por porción)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="servingsPerContainer" className="text-xs text-muted-foreground">
                    Porciones/envase
                  </Label>
                  <Input
                    id="servingsPerContainer"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.nutrition.servingsPerContainer}
                    onChange={(e) => handleNutritionChange("servingsPerContainer", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="calories" className="text-xs text-muted-foreground">
                    Calorías
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.nutrition.calories}
                    onChange={(e) => handleNutritionChange("calories", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="protein" className="text-xs text-muted-foreground">
                    Proteínas (g)
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.nutrition.protein}
                    onChange={(e) => handleNutritionChange("protein", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="carbs" className="text-xs text-muted-foreground">
                    Carbohidratos (g)
                  </Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.nutrition.carbs}
                    onChange={(e) => handleNutritionChange("carbs", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="fat" className="text-xs text-muted-foreground">
                    Grasas (g)
                  </Label>
                  <Input
                    id="fat"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.nutrition.fat}
                    onChange={(e) => handleNutritionChange("fat", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Sección: Imagen del Producto */}
          <SectionCard title="Imagen del Producto" icon={<ImageIcon className="w-4 h-4" />}>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group">
                  <div className="relative aspect-square max-w-[200px] rounded-2xl overflow-hidden border-2 border-border shadow-lg transition-all duration-300 hover:shadow-xl">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full shadow-lg hover:scale-110 transition-transform bg-background/90 hover:bg-primary text-black hover:text-black"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Haz clic en la X para remover la imagen
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 rounded-xl px-6"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir imagen
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    La imagen se subirá después de crear el suplemento
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Error de submit */}
          {errors.submit && (
            <div className="bg-destructive/10 border border-destructive/40 rounded-xl p-4 animate-in slide-in-from-top-2">
              <p className="text-sm text-destructive font-medium">{errors.submit}</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="px-6"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? "Guardando..." : "Creando..."}
              </>
            ) : (
              <>
                {isEditing ? "Guardar Cambios" : "Crear Suplemento"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
