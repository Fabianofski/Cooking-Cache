<script lang="ts">
	export let data;
</script>

<div class="card w-full bg-base-100 shadow-xl">
	<figure class="w-full max-h-96 flex items-center flex-col">
		<img
			class="w-full max-w-xl"
			src={data.recipe.image}
			alt={`${data.recipe.title} Cover`}
			style="object-fit: cover;"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{data.recipe.title}
			<div class="card-actions justify-end">
				{#each data.recipe.tags as tag}
					<div class="badge badge-outline">{tag}</div>
				{/each}
			</div>
		</h2>
		<p>{data.recipe.description}</p>
		<a href={data.recipe.url} class="btn btn-primary">
			<img class="h-6" src="/link.svg" alt="link" /> Zum Originalrezept
		</a>
		<div class="overflow-x-auto">
			<table class="table">
				<!-- head -->
				<thead>
					<tr>
						<th>Zutat</th>
						<th>Anzahl</th>
					</tr>
				</thead>
				<tbody>
					<tr class="hover">
						<th>Burger Buns</th>
						<td>2</td>
					</tr>
					<tr class="hover">
						<!-- row 2 -->
						<th>Burger Pattys</th>
						<td>2</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p>
			Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
			invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
			justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
			ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
			eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
			et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
			sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
			elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
			diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
			gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure
			dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat
			nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
			zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet,
			consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
			aliquam erat volutpat.
		</p>
	</div>
</div>
