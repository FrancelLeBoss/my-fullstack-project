import Swal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";

const themedSwal = Swal.mixin({
	background: "rgba(255,255,255,0.97)",
	color: "#111827",
	backdrop: "rgba(15, 23, 42, 0.45)",
	width: 440,
	padding: "1.5rem",
	buttonsStyling: false,
	customClass: {
		popup:
			"rounded-[1.75rem] border border-amber-100 shadow-[0_24px_80px_rgba(17,24,39,0.18)] backdrop-blur-sm",
		title: "text-xl font-semibold tracking-tight text-slate-900",
		htmlContainer: "text-sm leading-6 text-slate-600",
		confirmButton:
			"rounded-full bg-primary px-5 py-2.5 font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40",
		cancelButton:
			"rounded-full bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300",
	},
	iconColor: "#fea928",
	confirmButtonColor: "#fea928",
});

export function fireThemedAlert(options: SweetAlertOptions): Promise<SweetAlertResult> {
	return themedSwal.fire(options);
}

export function fireThemedToast(options: SweetAlertOptions): Promise<SweetAlertResult> {
	return themedSwal.fire({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 2100,
		timerProgressBar: true,
		...options,
	});
}

export function fireThemedConfirm(options: SweetAlertOptions): Promise<SweetAlertResult> {
	return themedSwal.fire({
		showCancelButton: true,
		confirmButtonText: "OK",
		cancelButtonText: "Annuler",
		...options,
	});
}
