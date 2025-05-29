<template>
  <Page>
    <NotesList :notes="notesStore.items" />
  </Page>
</template>


<script setup lang="ts">
import { Page } from '@lectorium/mobile/features/app.core'
import { NotesList, useNotesStore } from '../features/notes'

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

const notesStore = useNotesStore()
</script>