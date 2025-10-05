"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Eye,
  Info,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";
import Mainlayout from "@/component/layout";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { Dashboard1 } from "@/component/interface/dataDashboard";
import axios from "axios";
import DashboardKontrak from "./test";

interface Activity {
  nama_pekerjaan: string;
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
  id?: string;
  title: string;
  total_value: number;
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
  const [dataDashboard2, setDataDashboard2] = useState<ProjectData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);

  const baseUrl = "http://103.177.176.202:6402";

  // Function untuk get cookie - dipindahkan ke luar component atau gunakan yang dari cookies-next
  const getCookieLocal = (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const fetchDashboardData = useCallback(
    async (id_satdik: number): Promise<DashboardResponse> => {
      const token = getCookieLocal("XSX01");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (typeof token === "string" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = new URL(`${baseUrl}/dashboard`);

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

  const fetchDashboardData2 = useCallback(
    async (id_satdik: number): Promise<ProjectData[]> => {
      const token = getCookieLocal("XSX01");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (typeof token === "string" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = new URL(`${baseUrl}/dashboard2`);

      if (id_satdik !== 0) {
        url.searchParams.set("id_satdik", id_satdik.toString());
      }

      try {
        const response = await axios.get<{ data: ProjectData[] }>(
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
        const token = getCookieLocal("XSX01");

        if (typeof token === "string" && token) {
          const decoded = jwtDecode<DecodedToken>(token);

          setUserRole(decoded.type);
          console.log("User Role:", decoded.type);

          switch (decoded.type) {
            case "Operator Satdik":
              const operatorSatdikId = Number(decoded.id_unit_kerja);
              setSelectedSatdikId(operatorSatdikId);
              console.log("ID Satdik Operator:", operatorSatdikId);
              break;
            case "Admin Pusat":
              setSelectedSatdikId(0);
              console.log("Admin Pusat - Default ID: 0");
              break;
            case "Admin Satdik":
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
      if (!userRole) return;

      setLoading(true);

      try {
        console.log("Fetching dashboard data for ID Satdik:", IdSatdik);
        const dashboardData = await fetchDashboardData(IdSatdik);
        const dashboardData2 = await fetchDashboardData2(IdSatdik);

        console.log("Dashboard Data 2 Response:", dashboardData2);

        // Handle response - API mengembalikan array langsung
        if (Array.isArray(dashboardData2) && dashboardData2.length > 0) {
          // Add id to each project if not exists
          const projectsWithId = dashboardData2.map((project, index) => ({
            ...project,
            id: project.id || `project-${index}`,
          }));
          setDataDashboard2(projectsWithId);
        } else {
          console.warn("No valid project data received");
          setDataDashboard2([]);
        }

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
        setDataDashboard2([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [IdSatdik, userRole, fetchDashboardData, fetchDashboardData2]);

  // Utility functions
  const formatRupiah = (amount: number): string => {
    return amount.toLocaleString("id-ID");
  };

  const formatCurrency = (amount: string | number): string => {
    if (!amount && amount !== 0) return "Rp 0";

    const numericAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
        : amount;

    if (isNaN(numericAmount)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

 
  interface ProjectData {
  id?: string;
  title: string;
  total_value: number;
  activities?: Activity[];
}

interface ProjectCardProps {
  project: ProjectData;
  projectIndex: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, projectIndex }) => {
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 5;
    
    const isExpanded = expandedCards[project.id || ''] || false;
    
    // Filter activities based on search query
    const filteredActivities = useMemo(() => {
      const activities = project.activities || [];
      if (!searchQuery.trim()) return activities;
      
      const query = searchQuery.toLowerCase();
      return activities.filter(activity => 
        activity.nama_pekerjaan?.toLowerCase().includes(query) ||
        activity.pic?.toLowerCase().includes(query) ||
        activity.namaKontraktor?.toLowerCase().includes(query)
      );
    }, [project.activities, searchQuery]);
    
    // Reset to first page when search query changes
    React.useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery]);
    
    // Pagination calculations for filtered activities
    const totalItems = filteredActivities.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentActivities = filteredActivities.slice(startIndex, endIndex);
    const hasActivities = (project.activities || []).length > 0;

    const toggleCardExpansion = (cardId: string) => {
      setExpandedCards(prev => ({
        ...prev,
        [cardId]: !prev[cardId]
      }));
    };

    const goToPrevious = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNext = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPage = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <Card className="w-full shadow-lg mb-4 md:mb-6">
        {/* Header */}
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs md:text-sm"></span>
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
              {hasActivities && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 w-8 h-8 p-0 md:hidden"
                  onClick={() => toggleCardExpansion(project.id || '')}
                >
                  {isExpanded ? (
                    <X className="w-3 h-3" />
                  ) : (
                    <Menu className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Stats Row */}
          <div className="bg-gray-100 p-3 md:p-4 border-b">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 text-center">
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">Anggaran</div>
                <div className="font-semibold text-sm md:text-base">
                  {formatCurrency(project.total_value)}
                </div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">Realisasi</div>
                <div className="font-semibold text-sm md:text-base">Rp 0</div>
              </div>
              <div>
                <div className="text-xs md:text-sm text-gray-600 mb-1">Deviasi</div>
                <div className="font-semibold text-red-600 text-sm md:text-base">
                  {formatCurrency(project.total_value)}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Target</div>
                <div className="font-semibold text-sm md:text-base">-</div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Realisasi</div>
                <div className="font-semibold text-sm md:text-base">0</div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Deviasi</div>
                <div className="font-semibold text-red-600 text-sm md:text-base">0</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-8 mt-3 md:mt-4">
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Progress Keuangan</div>
                <div className="text-xl md:text-2xl font-bold">0%</div>
              </div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Progress Fisik</div>
                <div className="text-xl md:text-2xl font-bold">0%</div>
              </div>
            </div>
          </div>

          {/* Total Project Value */}
          <div className="p-3 md:p-4 border-b bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button size="sm" variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto">
                <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm">Export Data PDF</span>
              </Button>
              <div className="sm:ml-4">
                <span className="text-xs md:text-sm text-gray-600">Anggaran Total Kegiatan</span>
                <div className="text-lg md:text-xl font-bold">
                  {formatCurrency(project.total_value)}
                </div>
              </div>
            </div>
          </div>

          {/* Content based on activities */}
          {!hasActivities ? (
            <div className="p-6 text-center bg-gray-50">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-600 mb-1">Belum ada kegiatan</h3>
              <p className="text-xs text-gray-500">Kegiatan untuk proyek ini belum tersedia</p>
            </div>
          ) : (
            <>
              {/* Search Bar - Added Feature */}
              <div className="p-3 md:p-4 bg-white border-b">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan pekerjaan, PIC, atau kontraktor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-xs text-gray-600">
                    Ditemukan {filteredActivities.length} kegiatan dari {project.activities?.length || 0} total kegiatan
                  </div>
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="bg-gray-50 border-b">
                  <div className="grid grid-cols-5 gap-1 p-3 text-xs font-semibold text-gray-700">
                    <div>Ruang Lingkup Pekerjaan</div>
                    <div>PIC</div>
                    <div>Nama Kontraktor</div>
                    <div>Progress Keuangan</div>
                    <div>Progress Fisik</div>
                  </div>
                </div>

                <div className="bg-white">
                  {currentActivities.length > 0 ? (
                    currentActivities.map((activity, activityIndex) => (
                      <div key={startIndex + activityIndex} className="grid grid-cols-5 gap-1 p-3 text-sm border-b hover:bg-gray-50">
                        <div className="font-medium">{activity.nama_pekerjaan}</div>
                        <div>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                            {activity.pic}
                          </Badge>
                        </div>
                        <div className="text-gray-600">{activity.namaKontraktor || '-'}</div>
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
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Tidak ada kegiatan yang sesuai dengan pencarian "{searchQuery}"</p>
                    </div>
                  )}
                </div>

                {/* Desktop Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} kegiatan
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentPage === 1} className="p-2">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex space-x-1">
                          {(() => {
                            const pages = [];
                            const showEllipsisStart = currentPage > 3;
                            const showEllipsisEnd = currentPage < totalPages - 2;
                            
                            // Always show first page
                            pages.push(
                              <Button
                                key={1}
                                variant={currentPage === 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(1)}
                                className={`w-8 h-8 p-0 ${
                                  currentPage === 1 ? "bg-blue-500 hover:bg-blue-600 text-white" : "hover:bg-gray-100"
                                }`}
                              >
                                1
                              </Button>
                            );
                            
                            // Show ellipsis if needed
                            if (showEllipsisStart && currentPage > 4) {
                              pages.push(
                                <span key="ellipsis-start" className="px-2 text-gray-400">...</span>
                              );
                            }
                            
                            // Show pages around current page
                            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                              if (i === 1 || i === totalPages) continue;
                              pages.push(
                                <Button
                                  key={i}
                                  variant={currentPage === i ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => goToPage(i)}
                                  className={`w-8 h-8 p-0 ${
                                    currentPage === i ? "bg-blue-500 hover:bg-blue-600 text-white" : "hover:bg-gray-100"
                                  }`}
                                >
                                  {i}
                                </Button>
                              );
                            }
                            
                            // Show ellipsis if needed
                            if (showEllipsisEnd && currentPage < totalPages - 3) {
                              pages.push(
                                <span key="ellipsis-end" className="px-2 text-gray-400">...</span>
                              );
                            }
                            
                            // Always show last page if there's more than 1 page
                            if (totalPages > 1) {
                              pages.push(
                                <Button
                                  key={totalPages}
                                  variant={currentPage === totalPages ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => goToPage(totalPages)}
                                  className={`w-8 h-8 p-0 ${
                                    currentPage === totalPages ? "bg-blue-500 hover:bg-blue-600 text-white" : "hover:bg-gray-100"
                                  }`}
                                >
                                  {totalPages}
                                </Button>
                              );
                            }
                            
                            return pages;
                          })()}
                        </div>
                        <Button variant="outline" size="sm" onClick={goToNext} disabled={currentPage === totalPages} className="p-2">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className={`md:hidden bg-white ${isExpanded ? "block" : "hidden"}`}>
                {currentActivities.length > 0 ? (
                  currentActivities.map((activity, activityIndex) => (
                    <div key={startIndex + activityIndex} className="p-4 border-b border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Ruang Lingkup</div>
                          <div className="font-semibold text-sm">{activity.nama_pekerjaan}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">PIC</div>
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                              {activity.pic}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Kontraktor</div>
                            <div className="text-sm text-gray-700">{activity.namaKontraktor || '-'}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Progress Keuangan</div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between"><span>Anggaran</span><span>0</span></div>
                              <div className="flex justify-between"><span>Realisasi</span><span>0</span></div>
                              <div className="flex justify-between"><span>Deviasi</span><span className="text-red-600">0</span></div>
                              <div className="text-center font-semibold">0%</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Progress Fisik</div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between"><span>Target</span><span>0</span></div>
                              <div className="flex justify-between"><span>Realisasi</span><span>0</span></div>
                              <div className="flex justify-between"><span>Deviasi</span><span className="text-red-600">0</span></div>
                              <div className="text-center font-semibold">0%</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 bg-blue-500 text-white hover:bg-blue-600">
                            <Eye className="w-3 h-3 mr-1" />Detail
                          </Button>
                          <Button size="sm" className="flex-1 bg-green-500 text-white hover:bg-green-600">
                            <FileText className="w-3 h-3 mr-1" />Docs
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Tidak ada kegiatan yang sesuai dengan pencarian "{searchQuery}"</p>
                  </div>
                )}

                {/* Mobile Pagination */}
                {totalPages > 1 && isExpanded && (
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex flex-col space-y-3">
                      <div className="text-sm text-gray-600 text-center">
                        Halaman {currentPage} dari {totalPages} ({totalItems} total kegiatan)
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentPage === 1}>
                          <ChevronLeft className="w-4 h-4 mr-1" />Sebelumnya
                        </Button>
                        <Button variant="outline" size="sm" onClick={goToNext} disabled={currentPage === totalPages}>
                          Selanjutnya<ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Bottom Section */}
          <div className="bg-gray-50 p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded flex items-center justify-center">
                    <FileText className="w-2 h-2 md:w-3 md:h-3 text-white" />
                  </div>
                  <span className="font-semibold text-xs md:text-sm">Dukungan Management</span>
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
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">₨</span>
                  </div>
                  <span className="font-semibold text-xs md:text-sm">Realisasi</span>
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

  if (loading) {
    return (
      <Mainlayout>
        <div className="min-h-screen bg-gray-50 p-2 md:p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div className="min-h-screen bg-gray-50 p-2 md:p-4">
        <div className="max-w-full mx-auto">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
              Dashboard Modernisasi Sarpras Pendidikan KP
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Monitoring kegiatan Modernisasi Sarpras Pendidikan KP
            </p>

            {userRole === "Admin Pusat" && (
              <div className="max-w-full mt-3 md:mt-4">
                <SelectSatdik
                  idSatdik={IdSatdik}
                  selectTedOption={setSelectedSatdikId}
                />
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-3 md:mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
              <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Pagu Total
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {formatCurrency(dataDashboard1?.total_anggaran || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Total Paket
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {dataDashboard1?.total_kegiatan || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Pengadaan Barang
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {formatCurrency(
                      dataDashboard1?.total_pengadaan_barang || 0
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Renovasi Gedung dan Bangunan
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {formatCurrency(dataDashboard1?.total_perbaikan || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Pembangunan Gedung Baru
                  </div>
                  <div className="text-sm md:text-xl font-bold">
                    {formatCurrency(
                      dataDashboard1?.total_pembangunan_baru || 0
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Realisasi Keuangan
                  </div>
                  <div className="text-sm md:text-xl font-bold">Rp 0</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Progress Pengadaan Barang
                  </div>
                  <div className="text-sm md:text-xl font-bold">0%</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Progress Renovasi Gedung
                  </div>
                  <div className="text-sm md:text-xl font-bold">0%</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Progress Pembangunan Baru
                  </div>
                  <div className="text-sm md:text-xl font-bold">0%</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">Deviasi</div>
                  <div className="text-sm md:text-xl font-bold">
                    {formatCurrency((dataDashboard1?.total_anggaran || 0) - 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Status Selesai
                  </div>
                  <div className="text-lg md:text-2xl font-bold">0</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="text-xs md:text-sm opacity-90">
                    Status Proses
                  </div>
                  <div className="text-lg md:text-2xl font-bold">0</div>
                </CardContent>
              </Card>
            </div>
          </div>
           <DashboardKontrak />

          {/* Project Cards */}
          {dataDashboard2 && dataDashboard2.length > 0 ? (
            dataDashboard2.map((project, index) => (
              <ProjectCard
                key={project?.id || `project-${index}`}
                project={project}
                projectIndex={index}
              />
            ))
          ) : (
            <Card className="w-full shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Tidak ada data proyek
                  </h3>
                  <p className="text-sm">
                    {loading
                      ? "Sedang memuat data..."
                      : "Belum ada data proyek yang tersedia untuk ditampilkan."}
                  </p>
                  <div className="mt-4 text-xs text-gray-400">
                    <p>Debug Info:</p>
                    <p>User Role: {userRole || "Not set"}</p>
                    <p>ID Satdik: {IdSatdik || "Not set"}</p>
                    <p>Data Length: {dataDashboard2?.length || 0}</p>
                    <p>Loading: {loading.toString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <DashboardKontrak />
    </Mainlayout>
  );
};

export default DashboardPages;
