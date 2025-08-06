import React from 'react';
import CompanyList from '../components/company/CompanyList';

function CompanyListPage() {
  return (
    <>
      <h1 className="mb-3">회사 목록</h1>
      <CompanyList />
    </>
  );
}

export default CompanyListPage;
