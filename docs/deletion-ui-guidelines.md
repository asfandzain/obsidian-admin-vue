# Deletion UI Guidelines (Frontend)

This document standardizes delete/deactivate UX so behavior is predictable across all pages.

## Action Priority

Always prefer:

1. Disable (`status -> inactive`)
2. Soft delete
3. Hard delete (admin-only, usually async)

Never expose hard delete as default table action.

## Action Visibility Rules

| State | Default Primary Action | Delete Button |
| --- | --- | --- |
| Active and deletable | Disable | Show (danger, secondary) |
| Active but has dependency risk | Disable | Show, but pre-check required |
| Inactive and recoverable | Restore | Show soft delete if policy allows |
| Soft deleted | Restore / Purge request | Hide normal delete |
| Protected (system role/permission) | None | Hide |

## Confirmation Dialog Standard

Before delete, fetch impact summary and display:

- Resource name and id
- Dependency counts (`users`, `roles`, `teams`, etc.)
- Operation type (`deactivate` or `soft delete`)
- Recovery window (`recoverableUntil`)

Example copy:

- Title: `Delete Role`
- Content: `This role is assigned to 3 users. Unassign users first, then retry.`

## Error Handling Contract

Map backend business codes consistently:

- `0000`: success toast + refresh table.
- `1009`: conflict modal with dependency details from `data.dependencies`.
- `1003`: permission denied toast.
- `8888`: force sign-out flow when returned by auth/session endpoints.

## Reusable Composable Template

Use a shared composable so each page does not duplicate deletion logic:

```ts
type DeleteConflict = {
  reason?: string;
  dependencies?: Record<string, number>;
  suggestedAction?: string;
};

type DeleteResult = {
  code: string;
  msg: string;
  data?: {
    action?: 'deactivated' | 'soft_deleted' | 'queued_for_hard_delete';
    recoverableUntil?: string;
  } & DeleteConflict;
};

export async function handleDeleteAction(
  request: () => Promise<DeleteResult>,
  onSuccess: () => Promise<void> | void,
  showConflict: (conflict: DeleteConflict) => void
) {
  const result = await request();

  if (result.code === '0000') {
    window.$message?.success(result.msg || 'Success');
    await onSuccess();
    return;
  }

  if (result.code === '1009') {
    showConflict({
      reason: result.data?.reason,
      dependencies: result.data?.dependencies,
      suggestedAction: result.data?.suggestedAction
    });
    return;
  }

  window.$message?.error(result.msg || 'Operation failed');
}
```

## Table Action Pattern

Recommended order for action column:

1. `Edit`
2. `Disable/Enable`
3. `Delete` (danger, secondary)

Avoid showing both `Disable` and `Delete` as primary danger actions at the same time.

## i18n Keys Recommendation

Keep these keys shared across modules:

- `common.deleteConflict`
- `common.dependencyExists`
- `common.recoverableUntil`
- `common.deactivateFirst`
- `common.restore`

