"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye, Info, Menu, X } from "lucide-react";
import Mainlayout from "@/component/layout";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { Dashboard1 } from "@/component/interface/dataDashboard";
import axios from "axios";

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
interface DashboardResponse {
  total_kegiatan: number;
  total_anggaran: number;
  total_perbaikan: number;
  total_pengadaan_barang: number;
  total_pembangunan_baru: number;
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
  const [IdSatdik, setSelectedSatdikId] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [dataDashboard1, setDataDashboard1] = useState<Dashboard1>();

  const baseUrl = "http://103.177.176.202:6402";

  // Function untuk get cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const fetchDashboardData = useCallback(
    async (id_satdik: number): Promise<DashboardResponse> => {
      const token = getCookie("XSX01");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (typeof token === "string" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = new URL(`${baseUrl}/dashboard`);

      // Hanya tambahkan id_satdik jika bukan 0 (untuk Admin Pusat bisa pilih semua)
      if (id_satdik !== 0) {
        url.searchParams.set("id_satdik", id_satdik.toString());
      }

      try {
        const response = await axios.get<{ data: DashboardResponse }>(
          url.toString(),
          { headers }
        );

        return response.data.data;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
    },
    [baseUrl]
  );

  // Effect untuk decode token dan set initial values
  useEffect(() => {
    const initializeUser = () => {
      try {
        const token = getCookie("XSX01");

        if (typeof token === "string" && token) {
          const decoded = jwtDecode<DecodedToken>(token);

          setUserRole(decoded.type);
          console.log("User Role:", decoded.type);

          switch (decoded.type) {
            case "Operator Satdik":
              // Operator langsung pakai id_unit_kerja
              const operatorSatdikId = Number(decoded.id_unit_kerja);
              setSelectedSatdikId(operatorSatdikId);
              console.log("ID Satdik Operator:", operatorSatdikId);
              break;

            case "Admin Pusat":
              // Admin Pusat default 0 (bisa pilih semua atau via dropdown)
              setSelectedSatdikId(0);
              console.log("Admin Pusat - Default ID: 0");
              break;

            case "Admin Satdik":
              // Admin Satdik bisa pilih atau default 0
              setSelectedSatdikId(0);
              console.log("Admin Satdik - Default ID: 0");
              break;

            default:
              console.warn("Unknown user role:", decoded.type);
              setSelectedSatdikId(0);
          }
        } else {
          console.error("No valid token found");
          setUserRole("");
          setSelectedSatdikId(0);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        setUserRole("");
        setSelectedSatdikId(0);
      }
    };

    initializeUser();
  }, []);

  // Effect untuk fetch data ketika IdSatdik atau userRole berubah
  useEffect(() => {
    const loadDashboardData = async () => {
      // Hanya fetch jika user role sudah ada
      if (!userRole) return;

      setLoading(true);

      try {
        console.log("Fetching dashboard data for ID Satdik:", IdSatdik);
        const dashboardData = await fetchDashboardData(IdSatdik);

        setDataDashboard1({
          ...dashboardData,
          total_anggaran: dashboardData.total_anggaran,
          total_kegiatan: dashboardData.total_kegiatan,
          total_perbaikan: dashboardData.total_perbaikan,
          total_pengadaan_barang: dashboardData.total_pengadaan_barang,
          total_pembangunan_baru: dashboardData.total_pembangunan_baru,
          
        });
        console.log("Dashboard data loaded successfully:", dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Handle error (show toast, set error state, etc.)
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [IdSatdik, userRole, fetchDashboardData]);

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
          namaKontraktor: "",
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
                <div className="font-semibold text-sm md:text-base">
                  Rp 6000000
                </div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Realisasi
                </div>
                <div className="font-semibold text-sm md:text-base">
                  555555555
                </div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Deviasi
                </div>
                <div className="font-semibold text-red-600 text-sm md:text-base">
                  50000
                </div>
              </div>
              <div className="md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">
                  Target
                </div>
                <div className="font-semibold text-sm md:text-base"></div>
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
                  Nilai Total Proyek Testing
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
                <div>Ruang Lingkup Pekerjaan Testing</div>
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

  // Utility function untuk format currency Indonesia
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Alternative format dengan custom function
  const formatCurrencyCustom = (amount) => {
    if (!amount && amount !== 0) return "Rp 0";

    // Convert to string and add thousand separators
    const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formatted}`;
  };

  // Alternative format dengan abbreviation untuk angka besar
  const formatCurrencyWithAbbr = (amount) => {
    if (!amount && amount !== 0) return "Rp 0";

    const trillion = 1000000000000;
    const billion = 1000000000;
    const million = 1000000;
    const thousand = 1000;

    if (amount >= trillion) {
      return `Rp ${(amount / trillion).toFixed(1)} T`;
    } else if (amount >= billion) {
      return `Rp ${(amount / billion).toFixed(1)} M`;
    } else if (amount >= million) {
      return `Rp ${(amount / million).toFixed(1)} Jt`;
    } else if (amount >= thousand) {
      return `Rp ${(amount / thousand).toFixed(0)} Rb`;
    } else {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    }
  };

  return (
    <Mainlayout>
      <div className="min-h-screen bg-gray-50 p-2 md:p-4">
        <div className="max-w-full mx-auto">
          {/* Dashboard Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
              Dashboard Modernisasi Sarpras Pendidikan Kp
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Monitoring kegiatan Modernisasi Sarpras Pendidikan Kp
            </p>

            {/* Define userRole here, or retrieve from context/auth */}
            {(() => {
              return userRole === "Admin Pusat" ? (
                <div className="max-w-full">
                  <SelectSatdik selectTedOption={setSelectedSatdikId} />
                </div>
              ) : null;
            })()}
            {/* Summary Stats */}
            <div className="mt-3 md:mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
              {/* Budget Information - Blue Tones */}

              <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Pagu Total
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {formatCurrency(dataDashboard1?.total_anggaran)}
                  </div>
                </CardContent>
              </Card>

              {/* Planning Information - Green Tones */}
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Total Paket
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {dataDashboard1?.total_kegiatan}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Pengadaan Barang
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                  {formatCurrency(dataDashboard1?.total_pengadaan_barang)}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Categories - Warm Tones */}
              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Renovasi Gedung dan Bangunan
                  </div>
                   <div className="text-sm md:text-xl font-bold">
                   {formatCurrency(dataDashboard1?.total_perbaikan)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Pembangunan Gedung Baru
                  </div>
                   <div className="text-sm md:text-xl font-bold"> 
                    {formatCurrency(dataDashboard1?.total_pembangunan_baru)}
                  </div>
                </CardContent>
              </Card>

              {/* Realization Information - Purple Tones */}
              <Card className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Realisasi Keuangan
                  </div>
                  <div className="text-sm md:text-xl font-bold">Rp - </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Realisasi Pengadaan Barang
                  </div>
                   <div className="text-sm md:text-xl font-bold">Rp - </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Realisasi Renovasi Gedung
                  </div>
                    <div className="text-sm md:text-xl font-bold">Rp - </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Realisasi Pembangunan Baru
                  </div>
                   <div className="text-sm md:text-xl font-bold">Rp - </div>
                </CardContent>
              </Card>

              {/* Status Information - Red & Success Tones */}
              <Card className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">Deviasi</div>
                  <div className="text-sm md:text-xl font-bold">
                  {formatCurrency(dataDashboard1?.total_anggaran - 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Kegiatan Selesai
                  </div>
                  <div className="text-lg md:text-2xl font-bold">
                    0
                  </div>
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
