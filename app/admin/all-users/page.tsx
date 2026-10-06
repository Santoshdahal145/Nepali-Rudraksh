"use client";

import { useEffect, useState } from "react";
import { UserType } from "@/app/types";
import useUserAdminHook from "@/hooks/tanstack-hooks/useUserAdmin";
import AllUserTopHeader from "./AllUserTopHeader";
import SearchAndFilter from "./SearchAndFilter";
import AllUserContent from "./AllUserContent";

export default function AdminAllUsersPage() {
  // Query parameters state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "firstName" | "lastName" | "email"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleVerifiedChange = (val: string) => {
    setVerifiedFilter(val);
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    if (val === "newest") {
      setSortBy("createdAt");
      setSortOrder("desc");
    } else if (val === "oldest") {
      setSortBy("createdAt");
      setSortOrder("asc");
    } else if (val === "name-asc") {
      setSortBy("firstName");
      setSortOrder("asc");
    } else if (val === "name-desc") {
      setSortBy("firstName");
      setSortOrder("desc");
    } else if (val === "email-asc") {
      setSortBy("email");
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setRoleFilter("all");
    setVerifiedFilter("all");
    setPage(1);
  };

  // TanStack Query
  const { getUsers } = useUserAdminHook(
    page,
    limit,
    debouncedSearch,
    roleFilter !== "all" ? (roleFilter as "ADMIN" | "USER") : undefined,
    verifiedFilter !== "all" ? verifiedFilter === "true" : undefined,
    sortBy,
    sortOrder,
  );

  const users: UserType[] = getUsers.data?.users ?? [];
  const pagination = getUsers.data?.pagination;

  return (
    <div className="space-y-6">
      <AllUserTopHeader />

      <SearchAndFilter
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        verifiedFilter={verifiedFilter}
        handleVerifiedChange={handleVerifiedChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
      />

      <AllUserContent
        users={users}
        pagination={pagination}
        isLoading={getUsers.isLoading}
        isError={getUsers.isError}
        error={getUsers.error}
        onRefetch={() => getUsers.refetch()}
        onPageChange={(newPage) => setPage(newPage)}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
