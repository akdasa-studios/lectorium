<template>
  <DataTable
    table-style="min-width: 50rem"
    paginator
    striped-rows
    data-key="code"
    show-gridlines
    removable-sort
    :value="rows"
    :rows="20"
    :rows-per-page-options="[20, 50]"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Tracks</span>
        <Button
          icon="pi pi-refresh"
          rounded
          raised
          @click="emit('refresh')"
        />
      </div>
    </template>

    <!-- Title Column -->
    <Column
      field="title.value"
      header="Title"
      sortable
      style="width: 50%"
    >
      <template #body="{ data } : { data: InboxTrackTableRow }">
        <AnnotatedCell :annotations="data.title.annotations">
          {{ data.title.value }}
        </AnnotatedCell>
      </template>
    </Column>

    <!-- Date Column -->
    <Column
      field="date.value"
      header="Date"
      sortable
      style="width: 10%"
    >
      <template #body="{ data }: { data: InboxTrackTableRow }">
        <AnnotatedCell :annotations="data.date.annotations">
          {{ data.date.value }}
        </AnnotatedCell>
      </template>
    </Column>

    <!-- Author Column -->
    <Column
      field="author.value"
      header="Author"
      sortable
      style="width: 10%"
    >
      <template #body="{ data } : { data: InboxTrackTableRow }">
        <AnnotatedCell :annotations="data.author.annotations">
          {{ data.author.value }}
        </AnnotatedCell>
      </template>
    </Column>

    <!-- Location Column -->
    <Column
      field="location.value"
      header="Location"
      sortable
      style="width: 10%"
    >
      <template #body="{ data } : { data: InboxTrackTableRow }">
        <AnnotatedCell :annotations="data.location.annotations">
          {{ data.location.value }}
        </AnnotatedCell>
      </template>
    </Column>

    <!-- References Column -->
    <Column
      field="references"
      header="References"
      style="width: 10%"
    >
      <template #body="{ data } : { data: InboxTrackTableRow }">
        <AnnotatedCell
          v-for="(reference, idx) of data.references"
          :key="idx"
          :value="reference"
          :annotations="reference?.annotations"
        >
          <Tag
            class="m-1"
            :severity="reference.annotations?.map(annotation => annotation.severity).includes('error') ? 'danger' : reference.annotations?.map(annotation => annotation.severity).includes('warn') ? 'warn': 'info'"
          >
            {{ reference.value }}
          </Tag>
        </AnnotatedCell>
      </template>
    </Column>

    <!-- Status Column -->
    <Column
      field="status"
      header="Status"
      sortable
      style="width: 10%"
    >
      <template #body="{ data } : { data: InboxTrackTableRow }">
        <Tag
          :severity="getStatusSeverity(data.status)"
        >
          {{ data.status }}
        </Tag>
      </template>
    </Column>

    <!-- Action Buttons Column -->
    <Column class="w-24 !text-end">
      <template #body="{ data } : { data: InboxTrackTableRow }">
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          rounded
          @click="emit('open', data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import Button from "primevue/button"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Tag from 'primevue/tag'
import { default as AnnotatedCell, type Annotation } from "./AnnotatedCell.vue"

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

export type Reference = (string|number)[]

export type AnnotatedValue<TValue> = {
  value: TValue
  annotations: Annotation[]
}

export type InboxTrackTableRow = {
  id: string
  title: AnnotatedValue<string>
  date: AnnotatedValue<string>
  author: AnnotatedValue<string>
  location: AnnotatedValue<string>
  references: AnnotatedValue<string>[]
  status: string
}

defineProps<{
  rows: InboxTrackTableRow[]
}>()

const emit = defineEmits<{
  open: [trackId: string]
  refresh: []
}>()

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function getStatusSeverity(status: string): string {
  switch (status) {
  case 'error': return 'danger'
  case 'ready': return 'success'
  case 'processing': return 'warning'
  default: return 'info'
  }
}
</script>
