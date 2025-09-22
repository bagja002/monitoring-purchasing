"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye, Info, Menu, X } from "lucide-react";
import Mainlayout from "@/component/layout";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

interface Activity {
  ruangLingkup: string;
  pic: string;
  namaKontraktor: string;
}

interface DecodedToken {
  exp: number;
  id_admin: string;
  id_unit_kerja: string;
  name: string;
  role: string;
  type: string;
}

interface ProjectData {
  id: string;
  title: string;
  totalValue: string;
  activities: Activity[];
}

const DashboardPages: React.FC = () => {
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});

  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [selectIdSatdik, setIdSatidk] = useState<number>(0);

  useEffect(() => {
    try {
      // Get token from cookie
      const token = getCookie("XSX01");

      if (typeof token === "string" && token) {
        // Decode token
        const decoded = jwtDecode<DecodedToken>(token);

        // Set user data
        setUserName(decoded.name);
        setUserRole(decoded.type);

        console.log("Decoded token:", decoded);
      } else {
        console.log("No token found or token is not a string");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setUserName("Guest");
      setUserRole("");
    }
  }, []);
  const formatRupiah = (amount: number): string => {
    return amount.toLocaleString("id-ID");
  };

  const toggleCardExpansion = (projectId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const projects: ProjectData[] = [
    {
      id: "1",
      title: "Pekerjaan Gedung Dan Bangunan Baru",
      totalValue: "217.180.104.000",
      activities: [
        {
          ruangLingkup: "Pembangunan Lapangan Basket",
          pic: "Prep Anggaran",
          namaKontraktor: "-",
        },
        {
          ruangLingkup: "Renovasi Gedung Utama",
          pic: "Project Manager",
          namaKontraktor: "PT. Bangun Jaya",
        },
      ],
    },
    {
      id: "2",
      title: "Pengadaan Peralatan Dan Mesin",
      totalValue: "150.500.200.000",
      activities: [
        {
          ruangLingkup: "Pengadaan Alat Berat",
          pic: "Procurement",
          namaKontraktor: "PT. Maju Bersama",
        },
        {
          ruangLingkup: "Pengadaan Peralatan IT",
          pic: "IT Procurement",
          namaKontraktor: "PT. Tech Solutions",
        },
      ],
    },
    {
      id: "3",
      title: "Pekerjaan Revitalisasi Gedung dan Bangunan",
      totalValue: "890.750.300.000",
      activities: [
        {
          ruangLingkup: "Revitalisasi Fasad Gedung",
          pic: "Construction Manager",
          namaKontraktor: "PT. Karya Pembangunan",
        },
        {
          ruangLingkup: "Perbaikan Infrastruktur",
          pic: "Infrastructure Lead",
          namaKontraktor: "PT. Infrastruktur Prima",
        },
      ],
    },
  ];

  const ProjectCard: React.FC<{ project: ProjectData }> = ({ project }) => {
    const isExpanded = expandedCards[project.id] || false;

    return (
      <Card className="w-full shadow-lg mb-4 md:mb-6">
        {/* Header */}
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs md:text-sm">
                  $
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm md:text-lg font-semibold truncate">
                  {project.title}
                </CardTitle>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 w-8 h-8 p-0"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 w-8 h-8 p-0"
              >
                <Info className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Stats Row - Responsive Grid */}
          <div className="bg-gray-100 p-3 md:p-4 border-b">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 text-center">
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Anggaran
                </div>
                <div className="font-semibold text-sm md:text-base">0</div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Realisasi
                </div>
                <div className="font-semibold text-sm md:text-base">0</div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Deviasi
                </div>
                <div className="font-semibold text-red-600 text-sm md:text-base">
                  0
                </div>
              </div>
              <div className="md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Target
                </div>
                <div className="font-semibold text-sm md:text-base">0</div>
              </div>
              <div className="md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Realisasi
                </div>
                <div className="font-semibold text-sm md:text-base">0</div>
              </div>
              <div className="md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Deviasi
                </div>
                <div className="font-semibold text-red-600 text-sm md:text-base">
                  0
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 mt-3 md:mt-4">
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Progress Keuangan
                </div>
                <div className="text-xl md:text-2xl font-bold">0%</div>
              </div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Progress Fisik
                </div>
                <div className="text-xl md:text-2xl font-bold">0%</div>
              </div>
            </div>
          </div>

          {/* Total Project Value */}
          <div className="p-3 md:p-4 border-b bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
              >
                <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm">Export Data PDF</span>
              </Button>
              <div className="sm:ml-4">
                <span className="text-xs md:text-sm text-gray-600">
                  Nilai Total Proyek
                </span>
                <div className="text-lg md:text-xl font-bold">
                  {project.totalValue}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <div className="block md:hidden bg-gray-50 p-3 border-b">
            <Button
              onClick={() => toggleCardExpansion(project.id)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              {isExpanded ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Tutup Detail
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 mr-2" />
                  Lihat Detail ({project.activities.length} kegiatan)
                </>
              )}
            </Button>
          </div>

          {/* Desktop Table - Hidden on mobile */}

          <div className="hidden md:block">
            {/* Table Header */}
            <div className="bg-gray-50 border-b">
              <div className="grid grid-cols-5 gap-1 p-3 text-xs font-semibold text-gray-700">
                <div>Ruang Lingkup Pekerjaan</div>
                <div>PIC</div>
                <div>Nama Kontraktor</div>
                <div>Progress Keuangan</div>
                <div>Progress Fisik</div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="bg-white">
              {project.activities.map((activity, activityIndex) => (
                <div
                  key={activityIndex}
                  className="grid grid-cols-5 gap-1 p-3 text-sm border-b hover:bg-gray-50"
                >
                  <div className="font-medium">{activity.ruangLingkup}</div>
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-orange-100 text-orange-800 border-orange-200 text-xs"
                    >
                      {activity.pic}
                    </Badge>
                  </div>
                  <div className="text-gray-600">{activity.namaKontraktor}</div>
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
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card View - Only show when expanded */}
          <div
            className={`md:hidden bg-white ${isExpanded ? "block" : "hidden"}`}
          >
            {project.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="p-4 border-b border-gray-200">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Ruang Lingkup
                    </div>
                    <div className="font-semibold text-sm">
                      {activity.ruangLingkup}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PIC</div>
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800 border-orange-200 text-xs"
                      >
                        {activity.pic}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Kontraktor
                      </div>
                      <div className="text-sm text-gray-700">
                        {activity.namaKontraktor}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-2">
                        Progress Keuangan
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Anggaran</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Realisasi</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deviasi</span>
                          <span className="text-red-600">0</span>
                        </div>
                        <div className="text-center font-semibold">0%</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-2">
                        Progress Fisik
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Target</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Realisasi</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deviasi</span>
                          <span className="text-red-600">0</span>
                        </div>
                        <div className="text-center font-semibold">0%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Detail
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500 text-white hover:bg-green-600"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Docs
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section - Always visible */}
          <div className="bg-gray-50 p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Left Side - Dukungan Management */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded flex items-center justify-center">
                    <FileText className="w-2 h-2 md:w-3 md:h-3 text-white" />
                  </div>
                  <span className="font-semibold text-xs md:text-sm">
                    Dukungan Management
                  </span>
                </div>
                <div className="space-y-2 text-xs md:text-sm">
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
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">₨</span>
                  </div>
                  <span className="font-semibold text-xs md:text-sm">
                    Realisasi
                  </span>
                </div>
                <div className="space-y-2 text-xs md:text-sm">
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
    return acc + parseFloat(project.totalValue.replace(/\./g, ""));
  }, 0);

  // Hitung total activities
  const totalActivities = projects.reduce((acc, project) => {
    return acc + project.activities.length;
  }, 0);

  return (
    <Mainlayout>
      <div className="min-h-screen bg-gray-50 p-2 md:p-4">
        <div className="max-w-full mx-auto">
          {/* Dashboard Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
              Dashboard Revitalisasi Prasarana dan Sarana
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Monitoring seluruh kegiatan proyek pembangunan dan revitalisasi
            </p>

            {/* Define userRole here, or retrieve from context/auth */}
            {(() => {
              return userRole === "Admin Pusat" ? (
                <div className="max-w-full">
                  <SelectSatdik
                    selectTedOption={(option: any) => {
                      setIdSatidk(option.id); // simpan ID
                    }}
                    setNameSatdik={(nama: string) => {
                      console.log("Nama satdik terpilih:", nama);
                    }}
                  />
                </div>
              ) : null;
            })()}
            {/* Summary Stats */}
            <div className="mt-3 md:mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Total Semua Proyek
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    Rp {totalAllProjects.toLocaleString("id-ID")}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Jumlah Proyek
                  </div>
                  <div className="text-lg md:text-2xl font-bold">
                    {projects.length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Total Aktivitas
                  </div>
                  <div className="text-lg md:text-2xl font-bold">
                    {totalActivities}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">Status</div>
                  <div className="text-lg md:text-2xl font-bold">Aktif</div>
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
    </Mainlayout>
  );
};

export default DashboardPages;
