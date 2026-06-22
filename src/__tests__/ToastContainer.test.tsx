import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "@/components/ToastContainer";
import { useToastStore } from "@/lib/stores/toast-store";

describe("ToastContainer", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("should render nothing when there are no toasts", () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it("should render toasts with messages", () => {
    useToastStore.getState().addToast("Producto agregado", "success");

    render(<ToastContainer />);

    expect(screen.getByText("Producto agregado")).toBeInTheDocument();
  });

  it("should remove toast when close button is clicked", async () => {
    const user = userEvent.setup();
    useToastStore.getState().addToast("Test toast", "info");

    render(<ToastContainer />);

    const closeBtn = screen.getByLabelText("Cerrar");
    await user.click(closeBtn);

    expect(screen.queryByText("Test toast")).not.toBeInTheDocument();
  });

  it("should render multiple toasts", () => {
    useToastStore.getState().addToast("Toast 1", "success");
    useToastStore.getState().addToast("Toast 2", "error");
    useToastStore.getState().addToast("Toast 3", "info");

    render(<ToastContainer />);

    expect(screen.getByText("Toast 1")).toBeInTheDocument();
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
    expect(screen.getByText("Toast 3")).toBeInTheDocument();
  });
});
