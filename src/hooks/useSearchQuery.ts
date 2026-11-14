import { useSearchParams } from "react-router-dom";
//------------- Manage search query in URL -------------
export const useSearchQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params, { replace: true });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");

    setSearchParams(params, { replace: true });
  };

  return {
    search,
    handleSearchChange,
    clearSearch,
  };
};
