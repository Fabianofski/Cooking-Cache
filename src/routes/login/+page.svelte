<script lang="ts">
	let loggingIn = true;
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl font-extrabold text-center mb-2">Werde Mitglied!🥂</h1>

	<div class="join w-full">
		<input
			class="btn flex-1 join-item"
			type="radio"
			name="options"
			aria-label="Login"
			value={true}
			bind:group={loggingIn}
		/>
		<input
			class="btn flex-1 join-item"
			type="radio"
			name="options"
			aria-label="Signup"
			value={false}
			bind:group={loggingIn}
		/>
	</div>

	<form class="flex flex-col gap-2">
		<div class="form-control w-full max-w-s">
			<label class="label" for="">
				<span class="label-text">E-Mail</span>
			</label>
			<input type="text" placeholder="E-Mail" class="input input-bordered w-full max-w-s" />
		</div>
		<div class="form-control w-full max-w-s">
			<label class="label" for="">
				<span class="label-text">Passwort</span>
			</label>
			<input type="password" placeholder="Passwort" class="input input-bordered w-full max-w-s" />
		</div>

		{#if !loggingIn}
			<div class="form-control w-full max-w-s">
				<label class="label" for="">
					<span class="label-text">Passwort bestätigen</span>
				</label>
				<input type="password" placeholder="*****" class="input input-bordered w-full max-w-s" />
			</div>
		{/if}

		<button class="btn btn-primary w-full">
			{loggingIn ? 'LOGIN' : 'SIGNUP'}
		</button>
	</form>
</div>
