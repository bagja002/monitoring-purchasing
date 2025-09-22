import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  Eye,
  Info
} from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  totalValue: string;
  activities: {
    ruangLingkup: string;
    pic: string;
    unitKerja: string[];
    statusProyek: string[];
    namaKontraktor: string;
  };
}

const Dashboard: React.FC = () => {
  const formatRupiah = (amount: number): string => {
    return amount.toLocaleString('id-ID');
  };

  const projects: ProjectData[] = [
    {
      id: '1',
      title: 'Pekerjaan Gedung Dan Bangunan',
      totalValue: '217.180.104.000',
      activities: {
        ruangLingkup: 'Sumber Dana',
        pic: 'Prep Anggaran',
        unitKerja: ['Humas', 'Monitoring', 'Pelaksanaan'],
        statusProyek: ['Rp 0', 'Rp 0', 'Rp 0'],
        namaKontraktor: '-'
      }
    },
    {
      id: '2',
      title: 'Pengadaan Peralatan Dan Mesin',
      totalValue: '150.500.200.000',
      activities: {
        ruangLingkup: 'Pengadaan Alat',
        pic: 'Procurement',
        unitKerja: ['Teknik', 'Quality Control', 'Instalasi'],
        statusProyek: ['Rp 50.000.000', 'Rp 25.000.000', 'Rp 0'],
        namaKontraktor: 'PT. Maju Bersama'
      }
    },
    {
      id: '3',
      title: 'Pembangunan Infrastruktur Jalan',
      totalValue: '890.750.300.000',
      activities: {
        ruangLingkup: 'Konstruksi Jalan',
        pic: 'Construction Manager',
        unitKerja: ['Survei', 'Konstruksi', 'Finishing'],
        statusProyek: ['Rp 200.000.000', 'Rp 150.000.000', 'Rp 75.000.000'],
        namaKontraktor: 'PT. Karya Pembangunan'
      }
    },
    {
      id: '4',
      title: 'Sistem Informasi Dan Teknologi',
      totalValue: '75.400.500.000',
      activities: {
        ruangLingkup: 'Development System',
        pic: 'IT Project Manager',
        unitKerja: ['Analysis', 'Development', 'Testing'],
        statusProyek: ['Rp 15.000.000', 'Rp 30.000.000', 'Rp 10.000.000'],
        namaKontraktor: 'PT. Digital Solutions'
      }
    },
    {
      id: '5',
      title: 'Peningkatan Kapasitas SDM',
      totalValue: '45.200.100.000',
      activities: {
        ruangLingkup: 'Training Program',
        pic: 'HR Development',
        unitKerja: ['Planning', 'Training', 'Evaluation'],
        statusProyek: ['Rp 10.000.000', 'Rp 20.000.000', 'Rp 5.000.000'],
        namaKontraktor: 'PT. Edukasi Prima'
      }
    },
    {
      id: '6',
      title: 'Pemeliharaan Dan Operasional',
      totalValue: '120.600.800.000',
      activities: {
        ruangLingkup: 'Maintenance',
        pic: 'Operations Manager',
        unitKerja: ['Preventive', 'Corrective', 'Monitoring'],
        statusProyek: ['Rp 40.000.000', 'Rp 30.000.000', 'Rp 15.000.000'],
        namaKontraktor: 'PT. Maintenance Pro'
      }
    }
  ];

  const ProjectCard: React.FC<{ project: ProjectData }> = ({ project }) => {
    return (
      <Card className="w-full shadow-lg mb-6">
        {/* Header */}
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {project.title}
                </CardTitle>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Stats Row */}
          <div className="bg-gray-100 p-4 border-b">
            <div className="grid grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Anggaran</div>
                <div className="font-semibold">0</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Realisasi</div>
                <div className="font-semibold">0</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Deviasi</div>
                <div className="font-semibold text-red-600">0</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Target</div>
                <div className="font-semibold">0</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Realisasi</div>
                <div className="font-semibold">0</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Deviasi</div>
                <div className="font-semibold text-red-600">0</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Progress Keuangan</div>
                <div className="text-2xl font-bold">0%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Progress Fisik</div>
                <div className="text-2xl font-bold">0%</div>
              </div>
            </div>
          </div>

          {/* Total Project Value */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                <Download className="w-4 h-4 mr-1" />
                Export Data PDF
              </Button>
              <div className="ml-4">
                <span className="text-sm text-gray-600">Nilai Total Proyek</span>
                <div className="text-xl font-bold">{project.totalValue}</div>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-gray-50 border-b">
            <div className="grid grid-cols-9 gap-1 p-3 text-xs font-semibold text-gray-700">
              <div>Ruang Lingkup Pekerjaan</div>
              <div>PIC</div>
              <div>Unit Kerja</div>
              <div>Status Proyek</div>
              <div>Nama Kontraktor</div>
              <div>Progress Keuangan</div>
              <div>Progress Fisik</div>
              <div>Detail</div>
              <div>Dokumentasi</div>
            </div>
          </div>

          {/* Table Row */}
          <div className="bg-white">
            <div className="grid grid-cols-9 gap-1 p-3 text-sm border-b hover:bg-gray-50">
              <div className="font-medium">{project.activities.ruangLingkup}</div>
              <div>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                  {project.activities.pic}
                </Badge>
              </div>
              <div className="text-gray-600">
                {project.activities.unitKerja.map((unit, index) => (
                  <div key={index}>{unit}</div>
                ))}
              </div>
              <div>
                <div className="space-y-1">
                  {project.activities.statusProyek.map((status, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-gray-600">{project.activities.namaKontraktor}</div>
              <div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Anggaran</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Realisasi</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deviasi</span>
                    <span className="text-red-600">0</span>
                  </div>
                  <div className="text-center font-semibold mt-2">0%</div>
                </div>
              </div>
              <div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Realisasi</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deviasi</span>
                    <span className="text-red-600">0</span>
                  </div>
                  <div className="text-center font-semibold mt-2">0%</div>
                </div>
              </div>
              <div>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-blue-500 text-white hover:bg-blue-600">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-blue-500 text-white hover:bg-blue-600">
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Side - Dukungan Management */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <FileText className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-sm">Dukungan Management</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prep Anggaran:</span>
                    <span className="font-semibold">Rp 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humas Monitoring:</span>
                    <span className="font-semibold">Rp 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pelaksanaan:</span>
                    <span className="font-semibold">Rp 0</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Realisasi */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">₨</span>
                  </div>
                  <span className="font-semibold text-sm">Realisasi</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humas Monitoring:</span>
                    <span className="font-semibold">Rp 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pelaksanaan:</span>
                    <span className="font-semibold">Rp 0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    );
  };

  const totalAllProjects = projects.reduce((acc, project) => {
    return acc + parseFloat(project.totalValue.replace(/\./g, ''));
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Revitalisasi Prasarana dan Sarana</h1>
          <p className="text-gray-600">Monitoring seluruh kegiatan proyek pembangunan dan pengembangan</p>
          
          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="text-sm opacity-90">Total Semua Proyek</div>
                <div className="text-2xl font-bold">{totalAllProjects.toLocaleString('id-ID')}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="text-sm opacity-90">Jumlah Kegiatan</div>
                <div className="text-2xl font-bold">{projects.length} Kegiatan</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="text-sm opacity-90">Status Keseluruhan</div>
                <div className="text-2xl font-bold">Aktif</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Cards */}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

      </div>
    </div>
  );
};

export default Dashboard;