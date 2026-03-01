# Component Unit Tests

Unit tests untuk semua Vue components di aplikasi Folder Explorer.

## Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

## Test Files

| File                           | Component                | Test Count | Description                             |
| ------------------------------ | ------------------------ | ---------- | --------------------------------------- |
| `CustomTreeNode.spec.ts`       | CustomTreeNode.vue       | 9          | Tests untuk tree node individual        |
| `CustomTreeView.spec.ts`       | CustomTreeView.vue       | 5          | Tests untuk tree view container         |
| `FolderTree.spec.ts`           | FolderTree.vue           | 8          | Tests untuk folder tree dengan search   |
| `FolderList.spec.ts`           | FolderList.vue           | 8          | Tests untuk folder list dan breadcrumb  |
| `FolderContextMenu.spec.ts`    | FolderContextMenu.vue    | 7          | Tests untuk context menu                |
| `FolderDialogs.spec.ts`        | FolderDialogs.vue        | 10         | Tests untuk dialogs (new/rename/delete) |
| `NotificationSnackbar.spec.ts` | NotificationSnackbar.vue | 8          | Tests untuk notification system         |

**Total: 55+ test cases**

## Test Coverage

Setiap component di-test untuk:

- ✅ Rendering (tampilan benar)
- ✅ Props (menerima dan menampilkan props dengan benar)
- ✅ Events (emit events dengan data yang benar)
- ✅ User interactions (click, input, dll)
- ✅ Conditional rendering (show/hide berdasarkan kondisi)
- ✅ Edge cases (empty state, null values, dll)

## Writing New Tests

1. Create file: `ComponentName.spec.ts`
2. Import utilities:
   ```typescript
   import { describe, it, expect } from "vitest";
   import { mountWithVuetify } from "../../test-utils";
   import MyComponent from "../MyComponent.vue";
   ```
3. Write tests:
   ```typescript
   describe("MyComponent", () => {
     it("should render", () => {
       const wrapper = mountWithVuetify(MyComponent);
       expect(wrapper.exists()).toBe(true);
     });
   });
   ```

## Test Utilities

Located in `src/test-utils/`:

- `mountWithVuetify()` - Mount component dengan Vuetify
- `createMockFolder()` - Create mock Folder data
- `createMockFolderTree()` - Create mock FolderTreeDTO data
- `flushPromises()` - Wait untuk async operations

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests independent**
4. **Test edge cases**
5. **Use test utilities untuk consistency**

## Documentation

Lihat `UNIT_TESTING_GUIDE.md` untuk dokumentasi lengkap.
