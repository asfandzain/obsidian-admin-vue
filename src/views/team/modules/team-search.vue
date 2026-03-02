<script setup lang="ts">
import { computed } from 'vue';
import { getEnableStatusOptions } from '@/constants/common';
import { useSearchFormActions } from '@/hooks/business/search-form';
import { $t } from '@/locales';

defineOptions({
  name: 'TeamSearch'
});

interface Props {
  organizationOptions: CommonType.Option<number>[];
}

defineProps<Props>();

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

interface TeamSearchModel {
  keyword: string | null;
  status: Api.Common.EnableStatus | null;
  organizationId: number | null;
}

const model = defineModel<TeamSearchModel>('model', { required: true });

const enableStatusOptions = computed(() => getEnableStatusOptions());
const { reset, search } = useSearchFormActions(model, () => emit('search'));
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="team-search">
        <NForm label-placement="top" :show-feedback="false">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('common.keyword')" class="pr-24px">
              <NInput
                v-model:value="model.keyword"
                clearable
                :placeholder="$t('common.keywordSearch')"
                @keyup.enter="search"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.team.organization')" class="pr-24px">
              <NSelect
                v-model:value="model.organizationId"
                clearable
                filterable
                :options="organizationOptions"
                :placeholder="$t('page.team.organizationPlaceholder')"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('common.status')" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                clearable
                :options="enableStatusOptions"
                :placeholder="$t('common.selectStatus')"
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:24" class="pr-24px">
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

<style scoped></style>
