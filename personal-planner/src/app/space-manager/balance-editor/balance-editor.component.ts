import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpacesService } from '../../../adapters/spaces.service';
import { AppStateService } from '../../../services/app-state.service';
import { from } from 'rxjs';
import { SettingsAdapterService } from '../../../adapters/settings-adapter.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IBalance } from '../../interfaces/balance.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-balance-editor',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './balance-editor.component.html',
  styleUrl: './balance-editor.component.scss',
})
export class BalanceEditorComponent {
  onBalanceChange($event: Event, target: FormControl) {
    target.setValue(($event.target as HTMLInputElement)?.valueAsNumber * 60);
  }
  getDisplayName(spaceId: string): any {
    const space = this.spaces().find((s) => s._id === spaceId);
    return space ? space.displayName : 'Unknown Space';
  }
  appStateService = inject(AppStateService);
  settingsService = inject(SettingsAdapterService);
  decimal = new DecimalPipe('en-GB');

  spaces = this.appStateService.spaces;
  assignableTime = computed((): number => {
    return this.appStateService.settings()?.frameSettings.availability.allocatableTime || 0;
  });
  balances = computed(() => {
    return this.appStateService.settings()?.frameSettings.balances || [];
  });

  remainingTime = computed(() => {
    return (
      this.assignableTime() -
      this.formChanges().balances!.reduce(
        (acc, balance) => acc + (balance.assignedTimePerFrame ?? 0),
        0
      )
    );
  });
  remainingTimeError = computed(() => {
    return this.remainingTime() < 0;
  });

  form = new FormGroup({
    balances: new FormArray<
      FormGroup<{
        spaceId: FormControl<string>;
        assignedTimePerFrame: FormControl<number>;
      }>
    >([]),
    remainingTime: new FormControl<number>(0, [Validators.min(0)]),
  });

  formChanges = toSignal(from(this.form.valueChanges), {
    initialValue: this.form.value,
  });

  constructor() {
    effect(() => {
      this.form.controls.balances.clear();
      this.setFormValues();
    });
    effect(() => {
      //update reamining to and convert minutes to hours and number should be display with one decimal
      const transformed = this.decimal.transform(this.remainingTime() / 60, '1.1-1');
      this.form.controls.remainingTime.setValue(
        Number.parseFloat(transformed !== null ? transformed : '0')
      );
    });
  }

  private setFormValues() {
    this.form.controls.balances.clear();
    this.spaces().forEach((space, index) => {
      this.form.controls.balances.push(
        new FormGroup({
          spaceId: new FormControl(space._id, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          assignedTimePerFrame: new FormControl(
            this.appStateService
              .settings()
              ?.frameSettings.balances.find(
                (item) => item.spaceId === space._id
              )?.assignedTimePerFrame ?? 0,
            {
              nonNullable: true,
              validators: [Validators.required, Validators.min(0)],
            }
          ),
        })
      );
    });
  }

  onSave() {
    if (this.form.valid) {
      const balances: IBalance[] = this.form.value.balances!.map(
        (balance, index) => ({
          spaceId: this.spaces()[index]._id,
          assignedTimePerFrame: balance!.assignedTimePerFrame ?? 0,
        })
      );
      this.settingsService.updateBalances(balances);
    }
  }

  onRevertChanges() {
    this.setFormValues();
    this.form.markAsPristine();
  }
}
