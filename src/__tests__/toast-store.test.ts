import { describe, it, expect, beforeEach } from "@jest/globals";
import { useToastStore } from "@/lib/stores/toast-store";

describe("ToastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("should start with no toasts", () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it("should add a toast with default type 'success'", () => {
    useToastStore.getState().addToast("Producto agregado");
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Producto agregado");
    expect(toasts[0].type).toBe("success");
  });

  it("should add toasts with different types", () => {
    useToastStore.getState().addToast("Error", "error");
    useToastStore.getState().addToast("Info", "info");
    const toasts = useToastStore.getState().toasts;
    expect(toasts[0].type).toBe("error");
    expect(toasts[1].type).toBe("info");
  });

  it("should remove a toast by id", () => {
    useToastStore.getState().addToast("Test");
    const { id } = useToastStore.getState().toasts[0];
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
