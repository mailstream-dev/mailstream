import { render } from "@testing-library/react";

import Index from "../app/HomePage";

describe("Index", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Index />);
    expect(baseElement).toBeTruthy();
  });
});
