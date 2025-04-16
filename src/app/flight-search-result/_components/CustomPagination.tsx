// Pagination.tsx
import React from "react";
import { Pagination as MuiPagination, Stack } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  paginate,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don’t render pagination if only one page
  if (totalPages <= 1) return null;

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    paginate(value);
  };

  return (
    <Stack spacing={2} alignItems="center" mt={4}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#1e1e1f",
            borderColor: "#32d095",
          },
          "& .Mui-selected": {
            backgroundColor: "#32d095",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#28b885",
            },
          },
        }}
      />
    </Stack>
  );
};

export default Pagination;
