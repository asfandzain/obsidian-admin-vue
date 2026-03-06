<script setup lang="ts">
import { computed } from 'vue';
import { useSearchFormActions } from '@/hooks/business/search-form';
import { $t } from '@/locales';

defineOptions({
  name: 'AuditSearch'
});

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

interface AuditSearchModel {
  keyword: string | null;
  action: string | null;
  logType: Api.Audit.AuditLogType | '' | null;
  userName: string | null;
  requestId: string | null;
  dateFrom: number | null;
  dateTo: number | null;
}

const model = defineModel<AuditSearchModel>('model', { required: true });

const { reset, search } = useSearchFormActions(model, () => emit('search'));

const logTypeOptions = computed(() => [
  { label: $t('page.audit.logTypeAll'), value: '' },
  { label: $t('page.audit.logTypeLogin'), value: 'login' },
  { label: $t('page.audit.logTypeApi'), value: 'api' },
  { label: $t('page.audit.logTypeOperation'), value: 'operation' },
  { label: $t('page.audit.logTypeData'), value: 'data' },
  { label: $t('page.audit.logTypePermission'), value: 'permission' }
]);
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="audit-search">
        <NForm label-placement="top" :show-feedback="false" class="audit-search-form">
          <NGrid responsive="screen" item-responsive :x-gap="24" :y-gap="14">
            <NFormItemGi span="24 s:12 m:6" :label="$t('common.keyword')">
              <NInput
                v-model:value="model.keyword"
                clearable
                :placeholder="$t('common.keywordSearch')"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.audit.action')">
              <NInput
                v-model:value="model.action"
                clearable
                :placeholder="$t('page.audit.actionPlaceholder')"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.audit.logType')">
              <NSelect
                v-model:value="model.logType"
                clearable
                :options="logTypeOptions"
                :placeholder="$t('page.audit.logTypePlaceholder')"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.audit.operator')">
              <NInput
                v-model:value="model.userName"
                clearable
                :placeholder="$t('page.audit.operatorPlaceholder')"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.audit.requestId')">
              <NInput
                v-model:value="model.requestId"
                clearable
                :placeholder="$t('page.audit.requestIdPlaceholder')"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.audit.dateFrom')">
              <NDatePicker
                v-model:value="model.dateFrom"
                type="datetime"
                clearable
                :placeholder="$t('page.audit.dateFromPlaceholder')"
                class="w-full"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.audit.dateTo')">
              <NDatePicker
                v-model:value="model.dateTo"
                type="datetime"
                clearable
                :placeholder="$t('page.audit.dateToPlaceholder')"
                class="w-full"
              />
            </NFormItemGi>
            <NFormItemGi span="24" class="pt-6px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-mdi-restore class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped>
.audit-search-form :deep(.n-form-item-label) {
  padding-bottom: 10px;
}
</style>
