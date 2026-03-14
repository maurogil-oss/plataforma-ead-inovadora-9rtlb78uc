import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductsTab from './commercial/ProductsTab'
import SpeakersTab from './commercial/SpeakersTab'
import CouponsTab from './commercial/CouponsTab'

export default function CommercialDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão Comercial</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie produtos, palestrantes e cupons de desconto do marketplace.
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6 w-full justify-start border-b rounded-none px-0 h-auto bg-transparent pb-4 gap-6">
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2"
          >
            Produtos & Loja
          </TabsTrigger>
          <TabsTrigger
            value="speakers"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2"
          >
            Palestrantes
          </TabsTrigger>
          <TabsTrigger
            value="coupons"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2"
          >
            Cupons Promocionais
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-0 outline-none">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="speakers" className="mt-0 outline-none">
          <SpeakersTab />
        </TabsContent>
        <TabsContent value="coupons" className="mt-0 outline-none">
          <CouponsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
