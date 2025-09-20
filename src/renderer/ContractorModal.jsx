import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function ContractorModal({ visible, onHide, onSubmit }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [contractors, setContractors] = useState([]);

  // Add contractor form state
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNo: "",
    document: null,
  });

  // Load contractors from DB on mount or when modal is shown
  useEffect(() => {
    if (visible) {
      loadContractors();
    }
  }, [visible]);

  const loadContractors = async () => {
    try {
      const contractors = await window.MessageHandler.getAllContractors();
      setContractors(contractors.map((c) => c.dataValues || c));
    } catch (error) {
      console.error("Error loading contractors:", error);
    }
  };

  // Form change handler
  const handleChange = (field, value) => {
    console.log("file is ", field, value);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submit handler for add contractor
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let documentBuffer = null;
      let fileName = null;

      // If a file is selected, read it as buffer
      if (form.document) {
        documentBuffer = await form.document.arrayBuffer();
        fileName = form.document.name;
      }

      const dataToSend = {
        name: form.name,
        address: form.address,
        contactNo: form.contactNo,
        documentBuffer: documentBuffer,
        fileName: fileName,
      };

      console.log("=== DEBUG: Sending data from UI ===");
      console.log("Data to send:", JSON.stringify({
        ...dataToSend,
        documentBuffer: documentBuffer ? `[Buffer of ${documentBuffer.byteLength} bytes]` : null
      }, null, 2));
      console.log("File name:", fileName);

      await window.MessageHandler.addContractor(dataToSend);
      // Reload contractors after add
      await loadContractors();
      setForm({ name: "", address: "", contactNo: "", document: null });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding contractor:", error);
      alert("Failed to add contractor. Please try again.");
    }
  };

  // Remove contractor handler
  const handleRemoveContractor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contractor?")) {
      return;
    }
    try {
      await window.MessageHandler.removeContractor({ id });
      // Reload contractors after remove
      await loadContractors();
    } catch (error) {
      console.error("Error removing contractor:", error);
      alert("Failed to remove contractor. Please try again.");
    }
  };

  // Table action body template for remove button
  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => handleRemoveContractor(rowData.id)}
        tooltip="Remove Contractor"
      />
    );
  };

  // Don't render modal if not visible
  if (!visible) return null;

  return (
    <>
      {/* Main Contractor List Modal */}
      <div
        className="modal fade show"
        style={{ display: "block", zIndex: 1055 }}
        tabIndex="-1"
        role="dialog"
      >
        <div
          className="modal-dialog modal-lg"
          role="document"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Contractors</h5>
              <button
                type="button"
                className="btn btn-sm btn-success ms-auto"
                onClick={() => setShowAddModal(true)}
                style={{ fontSize: "1rem" }}
              >
                <i className="pi pi-plus" /> Add Contractor
              </button>
              <button
                type="button"
                className="btn-close ms-2"
                aria-label="Close"
                onClick={onHide}
              ></button>
            </div>
            <div className="modal-body">
              <DataTable
                value={contractors}
                paginator
                rows={10}
                emptyMessage="No contractors found"
              >
                <Column field="name" header="ठेकेदार नाव" />
                <Column field="address" header="पत्ता" />
                <Column field="contactNo" header="फोन न." />
                <Column field="originalFileName" header="दस्तऐवज" />
                <Column body={actionBodyTemplate} style={{ width: "4rem" }} />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>

      {/* Add Contractor Modal */}
      {showAddModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1065 }}
            tabIndex="-1"
            role="dialog"
          >
            <div
              className="modal-dialog"
              role="document"
              style={{ zIndex: 1070 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Contractor</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">ठेकेदार नाव *</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">पत्ता *</label>
                      <input
                        className="form-control form-control-sm"
                        value={form.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">फोन न.</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={form.contactNo}
                        onChange={(e) =>
                          handleChange("contactNo", e.target.value)
                        }
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Document</label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          handleChange("document", e.target.files[0] || null)
                        }
                        className="form-control form-control-sm"
                      />
                      {form.document && (
                        <small className="form-text text-muted">
                          Selected: {form.document.name}
                        </small>
                      )}
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-success me-2">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowAddModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1060 }}
          ></div>
        </>
      )}
    </>
  );
}
