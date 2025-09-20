import React, { useEffect, useMemo, useRef, useState } from "react";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AddTenderModal from "./AddTenderModal";
import ContractorModal from "./ContractorModal";
import { TabView, TabPanel } from "primereact/tabview";

export default function App() {
  const rows = useMemo(
    () => [
      {
        name: "मौजे वसखेड पाणी पुरवठा करणे",
        gp: "वसखेड / शेवगाव",
        account: "१५ वा वित्त आयोग",
        admin: "१,००,०००",
        tech: "८०,०००",
        pubDate: "०२/०४/२०२५",
        id: "०१/०४/२०२५",
      },
      {
        name: "रस्ता दुरुस्ती - झोन अ",
        gp: "शेवगाव",
        account: "१५ वा वित्त आयोग",
        admin: "७५,०००",
        tech: "६०,०००",
        pubDate: "०१/०३/२०२५",
        id: "०२/०३/२०२५",
      },
      {
        name: "पाण्याची टाकी बांधकाम",
        gp: "पाथर्डी",
        account: "१६ वा वित्त आयोग",
        admin: "४५,०००",
        tech: "३०,०००",
        pubDate: "१५/०२/२०२५",
        id: "१६/०२/२०२५",
      },
      {
        name: "पूल देखभाल",
        gp: "कर्जत",
        account: "जिल्हा वार्षिक योजना",
        admin: "१,२०,०००",
        tech: "१,००,०००",
        pubDate: "२०/०१/२०२५",
        id: "२१/०१/२०२५",
      },
      {
        name: "लघु काम १",
        gp: "ग्रा.पं. वसखेड",
        account: "ग्रामनिधी",
        admin: "२५,०००",
        tech: "२०,०००",
        pubDate: "०५/१२/२०२४",
        id: "०६/१२/२०२४",
      },
      {
        name: "लघु काम २",
        gp: "ग्रा.पं. पाथर्डी",
        account: "जनसुविधा",
        admin: "३०,०००",
        tech: "२५,०००",
        pubDate: "१०/११/२०२४",
        id: "११/११/२०२४",
      },
      {
        name: "लघु काम ३",
        gp: "ग्रा.पं. कर्जत",
        account: "नागरी सुविधा",
        admin: "१५,०००",
        tech: "१०,०००",
        pubDate: "२२/१०/२०२४",
        id: "२३/१०/२०२४",
      },
      {
        name: "पाणीपुरवठा देखभाल",
        gp: "ग्रा.पं. शेवगाव",
        account: "अल्पसंख्याक विकास योजना",
        admin: "५०,०००",
        tech: "५,०००",
        pubDate: "०१/०९/२०२४",
        id: "०२/०९/२०२४",
      },
      {
        name: "शाळा दुरुस्ती",
        gp: "ग्रा.पं. वसखेड",
        account: "ब्लँक एक ठेवा",
        admin: "७०,०००",
        tech: "८,०००",
        pubDate: "१५/०८/२०२४",
        id: "१६/०८/२०२४",
      },
      {
        name: "आरोग्य केंद्र बांधकाम",
        gp: "ग्रा.पं. पाथर्डी",
        account: "अ.जा.व.न.घ.व.विकास",
        admin: "१,५०,०००",
        tech: "२०,०००",
        pubDate: "०५/०७/२०२४",
        id: "०६/०७/२०२४",
      },
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // profile popup
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // modal for new tender
  const [showModal, setShowModal] = useState(false);
  const [editTender, setEditTender] = useState(null); // Track selected tender for edit

  // modal for contractor
  const [showContractorModal, setShowContractorModal] = useState(false);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const tableHeader = (
    <div className="d-flex align-items-center justify-content-between w-100">
      <h5 className="mb-0" style={{ color: "#2563eb" }}>
        Tenders
      </h5>
    </div>
  );

  return (
    <div
      className="container-fluid p-2 app-bg"
      style={{ background: "linear-gradient(135deg,#e3f0ff 0%,#f8fafc 100%)" }}
    >
      {/* compact CSS overrides */}

      {/* Top header with PrimeReact Buttons */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="mb-0 app-title">KaaryaTender</h4>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-info" onClick={() => setShowModal(true)}>
            <i className="pi pi-plus me-1" />
            Add New Tender
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowContractorModal(true)}
          >
            <i className="pi pi-users me-1" />
            Contractor
          </button>

          <div className="ms-2 position-relative" ref={profileRef}>
            <button
              className="btn btn-profile p-0"
              onClick={() => setShowProfile((s) => !s)}
              aria-expanded={showProfile}
            >
              <div className="profile-circle d-flex align-items-center justify-content-center">
                <i className="pi pi-user" style={{ fontSize: 16 }} />
              </div>
            </button>

            {showProfile && (
              <div className="profile-popup shadow-sm">
                <div className="px-3 py-2">
                  <strong style={{ color: "#2563eb" }}>Lakhan</strong>
                  <div className="small text-muted mb-2">Administrator</div>
                  <button className="btn btn-danger btn-sm w-100">
                    <i className="pi pi-sign-out me-1" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="card mb-2">
        <div className="card-body p-2" style={{ padding: 0 }}>
          <DataTable
            value={rows}
            paginator
            rows={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            selectionMode="single"
            onPage={(e) => {
              if (e.rows !== undefined) setRowsPerPage(e.rows);
            }}
            header={tableHeader}
            globalFilter={globalFilter}
            globalFilterFields={[
              "name",
              "gp",
              "account",
              "admin",
              "tech",
              "pubDate",
              "id",
            ]}
            emptyMessage="No tenders found"
            size="small"
            stripedRows
            onRowClick={(e) => {
              setEditTender(e.data);
              setShowModal(true);
            }}
            style={{ width: "100%" }} // Make DataTable full width
            className="w-100" // Also add Bootstrap full width class
          >
            <Column
              field="name"
              header="कामाचे नाव"
              sortable
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="gp"
              header="ग्रापंचायत नाव/तालुका"
              sortable
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="account"
              header="लेखाशिर्ष"
              sortable
              style={{ minWidth: "9rem" }}
            />
            <Column
              field="admin"
              header="प्रासासकीय मान्यता रक्कम"
              sortable
              style={{ width: "10rem" }}
            />
            <Column
              field="tech"
              header="तांत्रिक मान्यता रक्कम"
              sortable
              style={{ width: "9rem" }}
            />
            <Column
              field="pubDate"
              header="निविदा प्रसिद्धी दिनांक"
              sortable
              style={{ width: "9rem" }}
            />
            <Column field="id" header="#" sortable style={{ width: "5rem" }} />
          </DataTable>
        </div>
      </div>

      {/* AddTenderModal component usage */}
      <AddTenderModal
        visible={showModal}
        onHide={() => {
          setShowModal(false);
          setEditTender(null);
        }}
        onSubmit={(formData) => {
          // handle form submit here (add or update logic)
          setShowModal(false);
          setEditTender(null);
        }}
        tender={editTender} // Pass selected tender for edit
      />
      <ContractorModal
        visible={showContractorModal}
        onHide={() => setShowContractorModal(false)}
        onSubmit={(contractorData) => {
          // handle contractor form submit here
          setShowContractorModal(false);
        }}
      />
    </div>
  );
}
