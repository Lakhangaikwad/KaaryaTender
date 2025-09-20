import React, { useEffect, useState } from "react";
import {
  district as districtData,
  talukas as talukaData,
} from "../utils/mahaGramData";
// Remove PrimeReact Dialog, Button, TabView imports

export default function AddTenderModal({ visible, onHide, onSubmit, tender }) {
  // Form state
  const [form, setForm] = useState({
    name: "",
    district: null,
    taluka: null,
    village: null,
    account: null,
    adminAmount: "",
    techAmount: "",
    pubDate: null,
    endDate: null,
    openDate: null,
    startOrderDate: null,
    adminOrder: "",
    adminOrderDate: null,
    techOrder: "",
    techOrderDate: null,
    newspaper: "",
    sarpanch: "",
    upsarpanch: "",
    officer: "",
    contractors: [],
    duration: "", // Add this field
  });

  // Sync form with tender prop for edit mode
  useEffect(() => {
    if (tender) {
      setForm({ ...form, ...tender });
    } else {
      setForm({
        name: "",
        district: null,
        taluka: null,
        village: null,
        account: null,
        adminAmount: "",
        techAmount: "",
        pubDate: null,
        endDate: null,
        openDate: null,
        startOrderDate: null,
        adminOrder: "",
        adminOrderDate: null,
        techOrder: "",
        techOrderDate: null,
        newspaper: "",
        sarpanch: "",
        upsarpanch: "",
        officer: "",
        contractors: [],
        duration: "",
      });
    }
    // eslint-disable-next-line
  }, [tender, visible]);

  // Dropdown options
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [contractorOptions, setContractorOptions] = useState([]);

  // Static options
  const accountOptions = [
    { label: "द.व.सु", value: "द.व.सु" },
    { label: "15 वा वित्त आयोग", value: "15 वा वित्त आयोग" },
    { label: "16 वा वित्त आयोग", value: "16 वा वित्त आयोग" },
    { label: "तांडा वस्ती सुधार योजना", value: "तांडा वस्ती सुधार योजना" },
    { label: "तीर्थक्षेत विकास योजना", value: "तीर्थक्षेत विकास योजना" },
    { label: "ग्रामनिधी", value: "ग्रामनिधी" },
    { label: "जिल्हा वार्षिक योजना", value: "जिल्हा वार्षिक योजना" },
    { label: "अ.जा.व.न.घ.व.विकास", value: "अ.जा.व.न.घ.व.विकास" },
    { label: "जनसुविधा", value: "जनसुविधा" },
    { label: "नागरी सुविधा", value: "नागरी सुविधा" },
    { label: "अल्पसंख्याक विकास योजना", value: "अल्पसंख्याक विकास योजना" },
    { label: "ब्लँक एक ठेवा", value: "ब्लँक एक ठेवा" },
  ];

  const durationOptions = [
    { label: "3 महिने", value: "3 महिने" },
    { label: "6 महिने", value: "6 महिने" },
    { label: "1 वर्ष", value: "1 वर्ष" },
    { label: "2 वर्ष", value: "2 वर्ष" },
  ];

  // Load districts from mahaGramData.js on mount
  useEffect(() => {
    setDistricts(
      districtData.map((d) => ({
        label: d.districtlocalname,
        value: d.districtcode,
      }))
    );
  }, []);

  // Load contractors from DB on mount
  const loadContractors = async () => {
    try {
      let contractors = await window.MessageHandler.getAllContractors();
      contractors = contractors.map((c) => c?.dataValues || c);
      setContractorOptions(
        contractors.map((c) => ({
          label: `${c.name} (${c.address})`,
          name: c.name,
          value: c.id,
        }))
      );
    } catch (error) {
      console.error("Error loading contractors:", error);
    }
  };

  useEffect(() => {
    if (visible) loadContractors();
  }, [visible]);

  // Load talukas from mahaGramData.js when district changes
  useEffect(() => {
    if (form.district) {
      setTalukas(
        talukaData
          .filter((t) => t.districtcode === form.district)
          .map((t) => ({
            label: t.subdistrictlocalname,
            value: t.subdistrictcode,
          }))
      );
    } else {
      setTalukas([]);
      setVillages([]);
    }
  }, [form.district]);

  // API: Load villages when taluka changes
  useEffect(() => {
    if (form.taluka) {
      window.MessageHandler.getVillagesByTakula({
        subdistrictcode: form.taluka,
      })
        .then((data) => {
          setVillages(data);
        })
        .catch((err) => {
          console.log(err);
          setVillages([]);
        });
    } else {
      setVillages([]);
    }
  }, [form.taluka]);

  // Form change handler
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Tab state for bootstrap tabs
  const [activeTab, setActiveTab] = useState("info");

  // Document list for Documents tab
  const documentList = [
    { label: "Jahirat" },
    { label: "Jahirat Patra" },
    { label: `Tender Notice (${form.name || "Tender"})` },
    { label: "Cover" },
    { label: "WorkOrder" },
    { label: "Technical and Financial" },
    { label: "Stamp Paper" },
  ];

  // For add contractor dropdown
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [selectedContractorToAdd, setSelectedContractorToAdd] = useState("");

  // Helper: get contractor object by value
  const getContractorByValue = (value) =>
    contractorOptions.find((c) => c.value === value);

  // Remove contractor from form.contractors
  const handleRemoveContractor = (value) => {
    setForm((prev) => ({
      ...prev,
      contractors: prev.contractors.filter((v) => v !== value),
    }));
  };

  // Add contractor to form.contractors
  const handleAddContractor = (e) => {
    console.log("e is ", e);
    if (
      selectedContractorToAdd &&
      !form.contractors.includes(selectedContractorToAdd)
    ) {
      console.log("selected contractort", selectedContractorToAdd);
      setForm((prev) => ({
        ...prev,
        contractors: [...prev.contractors, selectedContractorToAdd],
      }));
    }
    setSelectedContractorToAdd("");
    setShowAddContractor(false);
  };

  // Don't render modal if not visible
  if (!visible) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", zIndex: 1055 }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-xl"
          role="document"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <ul className="nav nav-tabs" style={{ width: "100%" }}>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "info" ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveTab("info")}
                  >
                    Info
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "documents" ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveTab("documents")}
                  >
                    Documents
                  </button>
                </li>
              </ul>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              ></button>
            </div>
            <div className="modal-body">
              {activeTab === "info" && (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* कामाचे नाव and कामाची मुदत */}
                    <div className="col-12 col-md-6 mb-2">
                      <label>कामाचे नाव *</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <label>कामाची मुदत *</label>
                      <select
                        className="form-select form-select-sm"
                        value={form.duration}
                        onChange={(e) =>
                          handleChange("duration", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        {/* ...durationOptions... */}
                        <option value="3 महिने">3 महिने</option>
                        <option value="6 महिने">6 महिने</option>
                        <option value="1 वर्ष">1 वर्ष</option>
                        <option value="2 वर्ष">2 वर्ष</option>
                      </select>
                    </div>
                    {/* जिल्हा, तालुका, ग्रापंचायत नाव in one row */}
                    <div className="col-12 col-md-4 mb-2">
                      <label>जिल्हा *</label>
                      <select
                        className="form-select form-select-sm"
                        value={form.district || ""}
                        onChange={(e) =>
                          handleChange("district", e.target.value)
                        }
                        required
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>तालुका *</label>
                      <select
                        className="form-select form-select-sm"
                        value={form.taluka || ""}
                        onChange={(e) => handleChange("taluka", e.target.value)}
                        required
                        disabled={!form.district}
                      >
                        <option value="">Select Taluka</option>
                        {talukas.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>ग्रापंचायत नाव *</label>
                      <select
                        className="form-select form-select-sm"
                        value={form.village || ""}
                        onChange={(e) =>
                          handleChange("village", e.target.value)
                        }
                        required
                        disabled={!form.taluka}
                      >
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.value} value={v.value}>
                            {v.label || v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* लेखाशिर्ष, प्रासासकीय मान्यता रक्कम *, तांत्रिक मान्यता रक्कम * in one row */}
                    <div className="col-12 col-md-4 mb-2">
                      <label>लेखाशिर्ष *</label>
                      <select
                        className="form-select form-select-sm"
                        value={form.account || ""}
                        onChange={(e) =>
                          handleChange("account", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        {accountOptions.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>प्रासासकीय मान्यता रक्कम *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={form.adminAmount}
                        onChange={(e) =>
                          handleChange("adminAmount", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>तांत्रिक मान्यता रक्कम *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={form.techAmount}
                        onChange={(e) =>
                          handleChange("techAmount", e.target.value)
                        }
                        required
                      />
                    </div>
                    {/* निविदा प्रसिद्धी दिनांक *, निविदा अंतिम दिनांक *, निविदा उघडणे दिनांक *, कार्यारंभ आदेश दिनांक * in one row */}
                    <div className="col-12 col-md-3 mb-2">
                      <label>निविदा प्रसिद्धी दिनांक *</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={form.pubDate || ""}
                        onChange={(e) =>
                          handleChange("pubDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label>निविदा अंतिम दिनांक *</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={form.endDate || ""}
                        onChange={(e) =>
                          handleChange("endDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label>निविदा उघडणे दिनांक *</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={form.openDate || ""}
                        onChange={(e) =>
                          handleChange("openDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                      <label>कार्यारंभ आदेश दिनांक *</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={form.startOrderDate || ""}
                        onChange={(e) =>
                          handleChange("startOrderDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    {/* प्रशासकीय मान्यता क्र. व दिनांक * and तांत्रिक मान्यता क्र. व दिनांक * in one row */}
                    <div className="col-12 col-md-6 mb-2">
                      <label>प्रशासकीय मान्यता क्र. व दिनांक *</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.adminOrder}
                        onChange={(e) =>
                          handleChange("adminOrder", e.target.value)
                        }
                        required
                      />
                      <input
                        type="date"
                        className="form-control form-control-sm mt-2"
                        value={form.adminOrderDate || ""}
                        onChange={(e) =>
                          handleChange("adminOrderDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <label>तांत्रिक मान्यता क्र. व दिनांक *</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.techOrder}
                        onChange={(e) =>
                          handleChange("techOrder", e.target.value)
                        }
                        required
                      />
                      <input
                        type="date"
                        className="form-control form-control-sm mt-2"
                        value={form.techOrderDate || ""}
                        onChange={(e) =>
                          handleChange("techOrderDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-2">
                      <label>वृत्तपत्रांचे नाव</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.newspaper}
                        onChange={(e) =>
                          handleChange("newspaper", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>सरपंच नाव</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.sarpanch}
                        onChange={(e) =>
                          handleChange("sarpanch", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>उप सरपंच नाव</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.upsarpanch}
                        onChange={(e) =>
                          handleChange("upsarpanch", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4 mb-2">
                      <label>ग्रामपंचायत अधिकारी नाव</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.officer}
                        onChange={(e) =>
                          handleChange("officer", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 mb-2">
                      <label>
                        ठेकेदार
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-success ms-2"
                          style={{
                            fontSize: "1rem",
                            verticalAlign: "middle",
                            padding: "0 4px",
                          }}
                          onClick={() => setShowAddContractor((v) => !v)}
                        >
                          <i className="pi pi-plus" /> Add one more
                        </button>
                      </label>
                      {/* Table for selected contractors */}
                      <table className="table table-bordered table-sm mt-2">
                        <thead>
                          <tr>
                            <th>नाव</th>
                            <th style={{ width: 60 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.contractors.map((value) => {
                            const c = getContractorByValue(value);
                            if (!c) return null;
                            return (
                              <tr key={value}>
                                <td>{c.label}</td>
                                <td className="text-end">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      handleRemoveContractor(value)
                                    }
                                  >
                                    <i className="pi pi-times" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {form.contractors.length === 0 && (
                            <tr>
                              <td
                                colSpan={2}
                                className="text-center text-muted"
                              >
                                No contractor selected
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {/* Add contractor dropdown */}
                      {showAddContractor && (
                        <div className="d-flex align-items-center mt-2">
                          <select
                            className="form-select form-select-sm"
                            value={selectedContractorToAdd}
                            onChange={(e) => {
                              const contractor = contractorOptions.filter(
                                (contractor) =>
                                  contractor.value === e.target.value
                              );
                              console.log("contractorfdj ", contractor);
                              setSelectedContractorToAdd(contractor);
                            }}
                            style={{ maxWidth: 300 }}
                          >
                            <option value="">Select Contractor</option>
                            {contractorOptions
                              .filter(
                                (c) => !form.contractors.includes(c.value)
                              )
                              .map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-success ms-2"
                            onClick={handleAddContractor}
                            disabled={!selectedContractorToAdd}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary ms-2"
                            onClick={() => setShowAddContractor(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-success me-2">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onHide}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
              {activeTab === "documents" && (
                <div className="row">
                  <div className="col-12">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th>Document Name</th>
                          <th style={{ width: "180px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentList.map((doc, idx) => (
                          <tr key={idx}>
                            <td>{doc.label}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-link text-primary me-2"
                                onClick={() => {}}
                              >
                                <i className="pi pi-eye" /> View
                              </button>
                              <button
                                type="button"
                                className="btn btn-link text-primary"
                                onClick={() => {}}
                              >
                                <i className="pi pi-print" /> Print
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop, ensure it's outside and has lower z-index */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
    </>
  );
}
