import {
  LayoutExecutorAsyncWorker,
  License,
  OrganicLayout,
} from "@yfiles/yfiles";
import licenseData from "./license.json";

// register the yFiles license in the worker as well
License.value = licenseData;

// initialize the helper class that handles the messaging between the main thread and the worker
LayoutExecutorAsyncWorker.initializeWebWorker((graph, layoutDescriptor) => {
  if (layoutDescriptor.name === "OrganicLayout") {
    // create and apply a new hierarchical layout using the given layout properties
    const layout = new OrganicLayout(layoutDescriptor.properties);
    layout.applyLayout(graph);
  }
});
