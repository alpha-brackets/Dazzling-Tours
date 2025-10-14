// Example usage of Admin Components
// This file demonstrates how to import and use the admin components

import React from "react";
import {
  // Layout Components
  AdminCard,
  AdminHeader,
  AdminPageLayout,

  // Form Components
  AdminFormGroup,
  AdminFormLabel,
  AdminFormControl,
  AdminButton,

  // Alert Components
  AdminAlert,

  // Modal Components
  AdminModal,
  AdminModalHeader,
  AdminModalBody,
  AdminModalFooter,
} from "./index";

// Example component demonstrating usage
const ExampleAdminPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tourName, setTourName] = React.useState("");
  const [isLoading] = React.useState(false);

  return (
    <AdminPageLayout
      title="Example Admin Page"
      subtitle="Demonstrating admin components"
      currentPath="/admin/example"
    >
      {/* Alert Example */}
      <AdminAlert type="success" message="Welcome to the admin panel!" />

      {/* Form Example */}
      <AdminCard>
        <AdminHeader title="Create Tour" subtitle="Add a new tour package" />

        <form onSubmit={(e) => e.preventDefault()}>
          <AdminFormGroup>
            <AdminFormLabel htmlFor="tourName" required>
              Tour Name
            </AdminFormLabel>
            <AdminFormControl
              id="tourName"
              type="text"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              placeholder="Enter tour name"
              size="lg"
            />
          </AdminFormGroup>

          <AdminButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            loadingText="Creating..."
          >
            Create Tour
          </AdminButton>
        </form>
      </AdminCard>

      {/* Modal Example */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AdminModalHeader>
          <h3>Confirm Action</h3>
        </AdminModalHeader>
        <AdminModalBody>
          <p>Are you sure you want to perform this action?</p>
        </AdminModalBody>
        <AdminModalFooter>
          <AdminButton
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </AdminButton>
          <AdminButton variant="primary" onClick={() => setIsModalOpen(false)}>
            Confirm
          </AdminButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPageLayout>
  );
};

export default ExampleAdminPage;
