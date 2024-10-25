import Image from 'next/image';
import DoctorSearchForm from '@/components/DoctorSearchForm/page';
import DoctorSearchResults from '@/components/DoctorSearchResults/page';
import Footer from '@/components/footer/page'

export default function DoctorSearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/earthglobe2.jpg"
          alt="World Map"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="opacity-80"
          priority
        />
      </div>

      {/* Fixed Dark Overlay (excluding footer) */}
      <div className="fixed inset-0 bottom-auto bg-black bg-opacity-30 z-1" style={{ height: 'calc(100% - 60px)' }}></div>

      {/* Scrollable Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold mb-6 text-white">Find a Doctor</h1>
          <DoctorSearchForm />
          <DoctorSearchResults searchParams={searchParams} />
        </div>
        <Footer />
      </div>
    </div>
  );
}