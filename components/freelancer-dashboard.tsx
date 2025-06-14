'use client';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from './header';
import { DevfolioView } from './devfolio-view';
 import { MyProjects } from './my-projects';
import { EscrowWallet } from './wallet/escrow-wallet';


export function FreelancerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
         <div className="w-full container px-4 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="w-full lg:col-span-4">
            <Tabs defaultValue="devfolio" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
                <TabsTrigger
                  value="devfolio"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
                >
                  Devfolio
                </TabsTrigger>
                <TabsTrigger
                  value="my-projects"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
                >
                  My Projects
                </TabsTrigger>
              </TabsList>
              <TabsContent value="devfolio" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 py-4 p-2 lg:p-6">
                  <DevfolioView />
                </div>
              </TabsContent>
              <TabsContent value="my-projects" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
                  <MyProjects />
                </div>
              </TabsContent>
            </Tabs>{' '}
          </div>
          <div className="w-full lg:col-span-2 lg:pt-20">
            <EscrowWallet />
          </div>
        </div>
     </div>
  );
}
